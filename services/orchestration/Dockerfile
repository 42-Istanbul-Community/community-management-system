FROM python:3.13-slim

WORKDIR /orchestration

COPY ./srcs ./srcs

RUN pip install --no-cache-dir -r ./srcs/requirements.txt

CMD ["uvicorn", "srcs.main:app", "--host", "0.0.0.0", "--port", "8000"]
