import os
import psycopg

from fastapi import FastAPI

app = FastAPI()

@app.on_event("startup")
def startup():
    conn = psycopg.connect(
        host="postgres-auth",
        port=5432,
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=open(os.getenv("DB_PASSWORD_FILE")).read().strip(),
    )

    print("Auth: PostgreSQL Service Connection Success!")

    conn.close()


@app.get("/")
def health():
    return {
        "service": "auth",
        "status": "ok"
    }

