import threading
import uuid

import requests

from ..livepeer import Dvideo

pending = map()


class NotionClient:
    def __init__(self, api_key, page_id, livepeer_token) -> None:
        # base information
        self.api_key = api_key
        self.base_url = "https://api.notion.com/v1/"
        self.page_id = page_id
        self.headers = {
            "Authorization": "Bearer " + self.api_key,
            "Accept": "application/json",
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
        }
        self.token = livepeer_token

    def getBlock(self, includeImage=True):
        """
        read Notion page and return contents
        """
        url = self.base_url + f"blocks/{self.page_id}/children?page_size=100"
        response = requests.get(url, headers=self.headers)

        if response.status_code != 200:
            raise ValueError("Something wrong when reading notion page")

        blocks = response.json()["results"]
        content = [{"type": "separator", "url": ""}]
        for block in blocks:
            if block["type"] == "paragraph" and block["paragraph"]["rich_text"]:
                if content[-1]["type"] == "paragraph":
                    content[-1]["url"].append(block["paragraph"]["rich_text"][0]["plain_text"])
                else:
                    data = {"type": "paragraph", "url": [block["paragraph"]["rich_text"][0]["plain_text"]]}
                    content.append(data)
            elif includeImage and block["type"] == "image":
                source = block["image"]["type"]
                if block["image"][source]["url"]:
                    data = {"type": "image", "url": block["image"][source]["url"]}
                    content.append(data)
            elif block["type"] == "video":
                source = block["video"]["type"]
                if block["video"][source]["url"]:
                    data = {"type": "video", "url": block["video"][source]["url"]}
                    content.append(data)
            else:
                content.append({"type": "separator", "url": ""})

        filtered_content = []
        for item in content:
            if item["type"] != "separator":
                filtered_content.append(item)

        id = uuid().__str__()

        pending[id] = {
            "complete": False,
            "error": None,
            "livepeer_api_key": self.livepeer_token,
            "content": filtered_content,
        }

        threading.Thread(target=worker, args=(pending[id],)).start()

        return {"job_id": id}


def worker(task):
    filtered_content = task["content"]
    for item in filtered_content:
        if item["type"] == "video":
            video_url = item["url"]
            dvideo = Dvideo(video_url=video_url, livepeer_token=task["livepeer_api_key"])
            dvideo_url = dvideo.decentralize()
            if dvideo_url:
                item["url"] = dvideo_url

    task["complete"] = True
