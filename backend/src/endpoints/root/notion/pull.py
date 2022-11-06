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

        notion = NotionClient(params["api_key"], params["page_id"], params["livepeer_api_key"])
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
