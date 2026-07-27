FROM python:3.13-slim

WORKDIR /membership

RUN pip install --no-cache-dir \
        fastapi \
        uvicorn

COPY ./migrations ./migrations
COPY ./srcs ./srcs

CMD ["uvicorn", "srcs.main:app", "--host", "0.0.0.0", "--port", "8000"]
