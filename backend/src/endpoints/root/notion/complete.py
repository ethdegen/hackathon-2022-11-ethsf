from flask import jsonify, request
from .. import app
from ....domain.notion.client import NotionClient, pending


@app.route(
    "/notion/complete",
    methods=[
        "GET",
    ],
)
def notion_complete_get():
    try:
        params = request.args
        task = pending[id]

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
        print(e)
        return jsonify(
            {
                "success": False,
                "error": e.__str__(),
            },
        )
