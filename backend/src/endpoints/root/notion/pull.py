from flask import jsonify, request
from .. import app
from ....domain.notion.client import NotionClient


@app.route(
    "/notion/pull",
    methods=[
        "GET",
    ],
)
def notion_pull_get():
    try:
        params = request.args

        notion = NotionClient(params["api_key"], params["page_id"])
        response = notion.getBlock()

        return jsonify(
            {
                "success": True,
                "content": response,
            },
        )

    except Exception as e:
        print(e)
        return jsonify(
            {
                "success": False,
                "error": e.__str__(),
            },
        )
