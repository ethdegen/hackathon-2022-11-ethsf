import os
import tempfile  # to save it locally

from domain.animation.creator import AnimationCreator

image_url = "https://cdn.pixabay.com/photo/2020/02/06/09/39/summer-4823612_960_720.jpg"

tempFolder = tempfile.mkdtemp()
finalFolder = os.path.normpath(os.path.join(os.path.dirname(__file__), "resource"))

crt = AnimationCreator(tempFolder)

crt.downloadByUrl(image_url, 0)
crt.make_gif(os.path.join(finalFolder, "totoro.gif"))
