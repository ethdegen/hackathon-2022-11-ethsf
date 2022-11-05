import datetime

import requests


class NotionClient:
    def __init__(self, token, database_id, calendar_id, review_cycle=[3, 7, 14]) -> None:
        # base information
        self.token = token
        self.database_id = database_id
        self.calendar_id = calendar_id
        self.review_cycle = review_cycle
        self.headers = {
            "Authorization": "Bearer " + self.token,
            "Accept": "application/json",
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
        }

    def searchDatabase(self, limits=5) -> None:
        """
        search the data in database page, reorganize and save them
        """
        # read data
        url = f"https://api.notion.com/v1/databases/{self.database_id}/query"
        response = requests.request("POST", url, headers=self.headers)
        if response.status_code != 200:
            raise ValueError("database_id is wrong")
        database = response.json()

        # reorganize data
        data = {}  # empty dictionary to save data
        for page in database["results"]:
            # find all pages that are not organized
            # and save their dates and url
            if not limits:
                break
            if not page["properties"]["Organized"]["checkbox"]:
                key = page["id"]
                value = {"Date": page["properties"]["Date"]["date"]["start"], "url": page["properties"]["URL"]["url"]}
                data[key] = value
                limits -= 1

        # save data
        self.database = data

    def compute_date(self) -> dict:
        """
        compute the dates need to review
        """
        review = {}  # empty dictionary to store data
        data = self.database

        for id, value in data.items():
            first_day = value["Date"]
            dt = datetime.datetime.strptime(first_day, "%Y-%m-%d")
            days = []  # empty list to save dates for one page

            # compute the days that need to review
            for day in self.review_cycle:
                res = (dt + datetime.timedelta(days=day)).strftime("%Y-%m-%d")
                days.append(res)

            # combine all the ids that need to review in the same day
            for d in days:
                if d in review:
                    review[d].append(id)
                else:
                    review[d] = [id]

            # save the data
            self.dates = review

        return review

    def updatePage(self) -> None:
        """
        update the properties of all pages having been orgnazied
        """
        data = self.database

        for page_id in data.keys():
            url = f"https://api.notion.com/v1/pages/{page_id}"
            updateData = {"properties": {"Organized": {"checkbox": True}}}
            response = requests.patch(url, headers=self.headers, json=updateData)
            if response.status_code != 200:
                return ValueError("Can not update pages")

    def readCalendar(self) -> dict:
        """
        read the data in calendar page and save them to calendar.json
        """

        # read the data
        url = f"https://api.notion.com/v1/databases/{self.calendar_id}/query"
        response = requests.request("POST", url, headers=self.headers)

        if response.status_code != 200:
            raise ValueError("calendar_id is wrong")
        data = response.json()

        # filter the data
        filtered_data = {page["properties"]["Date"]["date"]["start"]: page["id"] for page in data["results"]}

        # save the date
        self.calendar = filtered_data

        return filtered_data

    def appendBlock(self, block_id, type="todo", linked_id="") -> str:
        """
        Add a new block in the one page
        Blocks can be headings, todos or quotes
        """
        url = f"https://api.notion.com/v1/blocks/{block_id}/children"
        heading = {
            "object": "block",
            "has_children": False,
            "type": "heading_2",
            "heading_2": {
                "rich_text": [
                    {
                        "type": "text",
                        "text": {
                            "content": "LeetCode",
                        },
                        "annotations": {"bold": True, "color": "blue"},
                        "plain_text": "LeetCode",
                    }
                ],
                "color": "default",
            },
        }
        quote = {
            "object": "block",
            "type": "quote",
            "quote": {
                "rich_text": [
                    {
                        "type": "text",
                        "text": {
                            "content": "😶",
                        },
                        "plain_text": "😶",
                    }
                ]
            },
        }
        todo = {
            "object": "block",
            "type": "to_do",
            "to_do": {
                "rich_text": [
                    {
                        "type": "mention",
                        "mention": {
                            "type": "page",
                            "page": {"id": linked_id},
                        },
                        "href": f"https://www.notion.so/{linked_id.replace('-', '')}",
                    },
                ],
                "checked": False,
            },
        }

        if type == "heading":
            content = heading
        elif type == "quote":
            content = quote
        elif type == "todo":
            content = todo
        else:
            raise ValueError

        response = requests.patch(
            url,
            headers=self.headers,
            json={
                "children": [content],
            },
        )
        if response.status_code != 200:
            raise ValueError("can not add new blocks")
        # return the id of the block that we have added
        return response.json()["results"][0]["id"]

    def createPage(self, date) -> str:
        """
        create a new page and return block id
        """
        url = "https://api.notion.com/v1/pages"
        newPage = {
            "object": "page",
            "icon": {"type": "emoji", "emoji": "😶"},
            "parent": {
                "type": "database_id",
                "database_id": "0ed9a0d3c83f4b6abf23c87cfa26ed0c",
            },
            "properties": {
                "Date": {
                    "id": "%3FKrf",
                    "type": "date",
                    "date": {
                        "start": date,
                    },
                },
                "Tags": {
                    "id": "Ogq%3F",
                    "type": "multi_select",
                    "multi_select": [
                        {
                            "id": "28f9c357-17be-429a-8653-87a14a3555cd",
                            "name": "LeetCode",
                            "color": "blue",
                        }
                    ],
                },
                "Name": {
                    "id": "title",
                    "type": "title",
                    "title": [
                        {
                            "type": "text",
                            "text": {
                                "content": "Review",
                            },
                            "plain_text": "Review",
                        }
                    ],
                },
            },
        }
        response = requests.post(url, json=newPage, headers=self.headers)
        if response.status_code != 200:
            raise ValueError("can not create new page")
        page_id = response.json()["id"]

        self.appendBlock(page_id, type="heading")
        block_id = self.appendBlock(page_id, type="quote")
        return block_id

    def readBlock(self, block_id, job="find_id"):
        """
        read block and return its id
        """
        url = f"https://api.notion.com/v1/blocks/{block_id}/children?page_size=100"
        response = requests.get(url, headers=self.headers)

        if response.status_code != 200:
            raise ValueError("block_id is wrong")
        print(response.json())
        blocks = response.json()["results"]

        if job == "find_id":
            for block in blocks:
                if block["type"] == "quote":
                    return block["id"]
        elif job == "find_num":
            return len(blocks)
        else:
            raise ValueError

    def updateBlock(self, block_id) -> None:
        """
        update the number of icons which is the number of pages
        that we need to review
        """
        n = self.readBlock(block_id, job="find_num")
        url = f"https://api.notion.com/v1/blocks/{block_id}"
        updatedata = {
            "quote": {
                "rich_text": [
                    {
                        "type": "text",
                        "text": {
                            "content": "😶" * n,
                        },
                        "plain_text": "😶" * n,
                    }
                ],
                "color": "default",
            }
        }
        response = requests.patch(url, json=updatedata, headers=self.headers)
        if response.status_code != 200:
            raise ValueError("can not update blocks")

    # =======================================================
    #                   HACkATHON PART
    # =======================================================

    def getURL(self, page_id="de32e778309648648c27fef0e74e3d4a", delete=False):
        url = f"https://api.notion.com/v1/blocks/{page_id}/children?page_size=100"
        response = requests.get(url, headers=self.headers)

        # get image urls
        urls = []
        block_id = []
        if response.status_code != 200:
            return urls
        blocks = response.json()["results"]
        for block in blocks:
            if block["type"] == "image":
                type = block.get("image", False).get("type", False)
                if type:
                    urls.append(block["image"][type]["url"])
                    block_id.append(block["id"])
        # delete image blocks from Notion
        if delete:
            for id in block_id:
                self.delete_block(id)
        return urls

    def delete_block(self, block_id):
        url = f"https://api.notion.com/v1/blocks/{block_id}"
        response = requests.delete(url, headers=self.headers)
        return response

    def image_add(self, page_id, image_url):
        url = f"https://api.notion.com/v1/blocks/{page_id}/children"
        block_info = [
            {
                "type": "image",
                "image": {"type": "external", "external": {"url": image_url}},
            }
        ]
        response = requests.patch(url, headers=self.headers, json={"children": block_info})

        return response.status_code

    def file_add(self, page_id, image_url):
        url = f"https://api.notion.com/v1/blocks/{page_id}/children"
        block_info = [
            {
                "type": "file",
                "file": {"type": "external", "external": {"url": image_url}},
            }
        ]
        response = requests.patch(url, headers=self.headers, json={"children": block_info})
        print(response.content)
        return response.status_code

    def embed_add(self, page_id, image_url):
        url = f"https://api.notion.com/v1/blocks/{page_id}/children"
        block_info = [
            {
                "type": "embed",
                "embed": {"url": image_url},
            }
        ]
        response = requests.patch(url, headers=self.headers, json={"children": block_info})

        return response.status_code
