from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel


class RegisterRequest(BaseModel):
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(...),
    picture: UploadFile | None = File(None)