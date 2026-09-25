from fastapi import FastAPI
from app.api import auth, problems

app = FastAPI(title="CodeMagic API")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(problems.router, prefix="/problems", tags=["Problems"])
