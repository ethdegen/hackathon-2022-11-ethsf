from flask import jsonify, request

from ....domain.notion.client import NotionClient
from .. import app


@app.route(
    "/sample/notion_plan",
    methods=[
        "POST",
    ],
)
def sample_notion_plan_post():
    params = request.json

    # create a notion object according the provided base information
    base_info = {
        "token": "secret_ThyBFJOGvfg9verCNa3So5dK3e8eGeZ5030j05XsWjn",
        "database_id": params["database_id"],
        "calendar_id": params["calendar_id"],
        "review_cycle": [2, 3, 4],
    }

    notion = NotionClient(**base_info)

    try:
        # Search database and calendar
        notion.searchDatabase()
        calendar = notion.readCalendar()

        # get the dates and update corresponding pages or create a new page
        for day, ids in notion.compute_date().items():
            block_id = notion.readBlock(calendar[day]) if day in calendar else notion.createPage(day)

            for id in ids:
                notion.appendBlock(block_id, linked_id=id)

            notion.updateBlock(block_id)

        # update the properties of each page
        notion.updatePage()

        return jsonify(
            {
                "success-test": True,
            },
        )

    except Exception as e:
        return jsonify(
            {
                "success": False,
                "error": e.__str__(),
            },
        )
