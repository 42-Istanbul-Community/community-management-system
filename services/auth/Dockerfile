FROM python:3.13-slim

WORKDIR /auth

RUN pip install --no-cache-dir -r requirements.txt

COPY ./srcs ./srcs

CMD ["uvicorn", "srcs.main:app", "--host", "0.0.0.0", "--port", "8000"]