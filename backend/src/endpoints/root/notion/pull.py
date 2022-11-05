from flask import jsonify, request
import requests

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

        response = requests.get(
            url=f"https://api.notion.com/v1/blocks/{params['page_id']}/children?page_size=100",
            headers={
                "Authorization": "Bearer " + params["api_key"],
                "Accept": "application/json",
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
        )

        return jsonify(
            {
                "success": True,
                "content": response.json()["results"],
            },
        )

    except Exception as e:
        return jsonify(
            {
                "success": False,
                "error": e.__str__(),
            },
        )
