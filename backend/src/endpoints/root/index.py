from .. import app


@app.route(
    "/",
    methods=[
        "GET",
    ],
)
def index_get():
    return "Welcome to ETH San Francisco 2022 Hackathon!"
