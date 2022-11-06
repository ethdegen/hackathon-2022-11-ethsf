import requests
from datetime import datetime
import json


def uploadVideo(video_url="https://www.youtube.com/watch?v=7AGND7UWwsg"):
    # Upload asset by URL
    token = "a616be3b-8980-4932-8079-0122e0106f95"
    url = "https://livepeer.studio/api/asset/import"
    headers = {
        "origin": "http://localhost:3000",
        "referer": "http://localhost:3000/",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }

    body = {
        "url": video_url,
        "name": datetime.now().strftime("%Y-%m-%d-%H-%M-%S"),
    }

    response = requests.post(url, headers=headers, data=json.dumps(body))
    print(response.json())


def uploadIPFS():
    pass


uploadVideo()
