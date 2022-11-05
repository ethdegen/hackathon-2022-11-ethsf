FROM python:3.10.7-bullseye

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get update && apt-get install -y git nodejs
RUN pip install --no-cache-dir --upgrade black
