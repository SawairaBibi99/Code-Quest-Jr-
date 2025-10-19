from fastapi import FastAPI
from routers.hint import router as hint_router

app = FastAPI(title="CodeQuest AI")
app.include_router(hint_router, prefix="/ai")

@app.get("/health")
async def health():
    return {"ok": True}
