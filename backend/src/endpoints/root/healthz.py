from flask import jsonify

from .. import app


@app.route(
    "/healthz",
    methods=[
        "GET",
    ],
)
def healthz_get():
    return jsonify(
        {
            "status": True,
        },
    )
