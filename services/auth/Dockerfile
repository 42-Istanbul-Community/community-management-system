FROM python:3.13-slim

WORKDIR /auth

RUN apt-get update \
    && apt-get install -y postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY ./migrations ./migrations
COPY ./seed ./seed
COPY ./srcs ./srcs

RUN pip install --no-cache-dir -r ./srcs/requirements.txt

EXPOSE 80

COPY ./tools/entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

CMD ["uvicorn", "srcs.main:app", "--host", "0.0.0.0", "--port", "80"]