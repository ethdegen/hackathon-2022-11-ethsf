from flask import jsonify, request

from ....domain.notion.client import NotionClient
from .. import app


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
        import traceback

        print(traceback.format_exc())
        return jsonify(
            {
                "success": False,
                "error": e.__str__(),
            },
        )
