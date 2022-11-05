from flask_cors import CORS

from .endpoints import app

print(f"Routes: {app.url_map})")


CORS(app, origins="*")
