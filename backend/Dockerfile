FROM python:3.8-slim-buster
RUN mkdir /backend
WORKDIR /backend
COPY app.py /backend
ENV FLASK_APP=app.py
COPY requirements.txt /backend/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt
RUN pip install https://huggingface.co/huspacy/hu_core_news_lg/resolve/main/hu_core_news_lg-any-py3-none-any.whl
COPY . .