from backend.src.domain.livepeer.Dvideo import Dvideo

video_url = "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c055c5a8-ecbe-4cef-ac2e-160c32d14523/test.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221106%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221106T032013Z&X-Amz-Expires=3600&X-Amz-Signature=847cebe7b113e9ac4fcfa5a8730ced309b242af093d5d07846a5134237fe1ad6&X-Amz-SignedHeaders=host&x-id=GetObject"
token = "8e39b76d-8a23-417c-bb64-e31e94d9796a"
object = Dvideo(video_url=video_url, livepeer_token=token)
dvideo_url = object.decentralize()

print(dvideo_url)
