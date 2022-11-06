import json
from datetime import datetime
from time import sleep

import requests


class Dvideo:
    def __init__(self, video_url, livepeer_token):
        self.video_url = video_url
        self.token = livepeer_token

    def uploadVideo(self):
        # Upload asset by URL and return asset id
        url = "https://livepeer.studio/api/asset/import"
        headers = {"Content-Type": "application/json", "Authorization": f"Bearer {self.token}"}

        body = {
            "url": self.video_url,
            "name": datetime.now().strftime("%Y-%m-%d-%H-%M-%S"),
        }
        response = requests.post(url, headers=headers, data=json.dumps(body))

        if response.status_code == 201:
            return response.json()["asset"]["id"]
        else:
            print("Something wrong when uploading video to livepeer!")
            print(response.json())
            return False

    def getStatus(self, asset_id, testMode=False):
        # get status of one asset according to its id
        url = f"https://livepeer.studio/api/asset/{asset_id}"
        headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
        response = requests.get(url, headers=headers)

        if not testMode:
            return response.json()["status"]["phase"]
        else:
            print(response.json())

    def uploadIPFS(self, asset_id):
        # uplaod asset to IPFS when it is ready and return playback url
        url = f"https://livepeer.studio/api/asset/{asset_id}"
        headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
        body = {"storage": {"ipfs": True}}
        response = requests.patch(url, headers=headers, json=body)

        if response.status_code == 200:
            return response.json()["playbackUrl"]
        else:
            print("Something wrong when uploading asset to IPFS")
            return False

    def decentralize(self):
        id = self.uploadVideo()
        count = 5
        while not id:
            if count > 0:
                id = self.uploadVideo()
                count -= 1
            else:
                return
        print("Upload video to livepeer successfully!")

        index = 1
        status = None
        while True:
            status = self.getStatus(id)
            if status != "ready" and status != "failed":
                print(index, status)
                index += 1
                sleep(1)
            elif status == "failed":
                self.getStatus(id)
                break
            else:
                break
        if status == "ready":
            print("\n\nVideo asset is ready!")
            Dvideo_url = self.uploadIPFS(id)
            if Dvideo_url:
                print("Decentralized video assert is ready!")
                return Dvideo_url
            else:
                print("Something wrong when uploading asset to IPFS")
        else:
            print("Something wrong when prepare assert")
            return False
