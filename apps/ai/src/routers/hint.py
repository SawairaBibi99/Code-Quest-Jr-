from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class Skill(BaseModel):
    loops: float = 0
    conditionals: float = 0

class HintReq(BaseModel):
    goal: str
    last_error: str | None = None
    skill: Skill

@router.post('/hint')
async def hint(req: HintReq):
    if req.last_error and 'loop' in req.last_error.lower():
        return {"hint": "Try a repeat block!"}
    if req.skill.loops < 0.3:
        return {"hint": "Use a repeat block to avoid repeating steps."}
    return {"hint": "Break it into small moves, then add a loop."}
