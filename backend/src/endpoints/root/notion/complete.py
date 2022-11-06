from flask import jsonify, request

from ....domain.notion.client import NotionClient, pending
from .. import app


@app.route(
    "/notion/complete",
    methods=[
        "GET",
    ],
)
def notion_complete_get():
    try:
        params = request.args
        task = pending[params["id"]]

        if task and task["complete"]:
            return (
                jsonify(
                    {
                        "success": True,
                        "content": task["content"],
                    }
                ),
            )

        return jsonify(
            {"success": False, "error": "still waiting"},
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
