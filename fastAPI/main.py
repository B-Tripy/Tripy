import ollama
import httpx
import uvicorn
import json
import os

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from redis.asyncio import Redis
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

# ---------------------------------
# 환경 설정
# ---------------------------------
load_dotenv()

app = FastAPI()

MODEL = "gemma3:1b"
OLLAMA_BASE_URL = "http://localhost:11434"
REDIS_URL = "redis://localhost:6379"

app.state.redis = None

# ---------------------------------
# CORS
# ---------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------
# Startup / Shutdown
# ---------------------------------
@app.on_event("startup")
async def startup_event():
    try:
        # Ollama 모델 preload
        await ollama.AsyncClient().generate(
            model=MODEL,
            prompt=" ",
            keep_alive=-1
        )
        print(f"{MODEL} preload 완료")

        # Redis 연결
        app.state.redis = Redis.from_url(
            REDIS_URL,
            decode_responses=True
        )
        print("Redis 연결 완료")

    except Exception as e:
        print("Startup 실패:", e)


@app.on_event("shutdown")
async def shutdown_event():
    if app.state.redis:
        await app.state.redis.close()
        print("Redis 연결 종료")


# ---------------------------------
# Health Check
# ---------------------------------
class HealthResponse(BaseModel):
    status: str
    ollama_status: str
    message: str


@app.get("/ai/health", response_model=HealthResponse)
async def health_check():
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)

        if res.status_code == 200:
            return HealthResponse(
                status="ok",
                ollama_status="healthy",
                message="FastAPI & Ollama 정상 동작"
            )
        else:
            return HealthResponse(
                status="ok",
                ollama_status="unhealthy",
                message=f"Ollama 상태 코드: {res.status_code}"
            )

    except Exception as e:
        return HealthResponse(
            status="error",
            ollama_status="down",
            message=str(e)
        )


# ---------------------------------
# Poem 생성
# ---------------------------------
class PoemsRequest(BaseModel):
    topic: str
    style: str


@app.post("/ai/poem")
async def create_poem(req: PoemsRequest):
    prompt = f"""
{req.topic}을 주제로
{req.style} 스타일의 시를 지어주세요.
"""

    response = await ollama.AsyncClient().generate(
        model=MODEL,
        prompt=prompt,
        keep_alive=-1
    )

    return {"summary": response["response"].strip()}


# ---------------------------------
# Chat (Redis 저장)
# ---------------------------------
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"


@app.post("/chat")
async def chat(req: ChatRequest):
    redis = app.state.redis
    history = []

    history.append({
        "role": "user",
        "content": req.message
    })

    response = await ollama.AsyncClient().chat(
        model=MODEL,
        messages=history,
        keep_alive=-1
    )

    ai_message = response["message"]["content"]

    history.append({
        "role": "assistant",
        "content": ai_message
    })

    if redis:
        session_key = f"chat_history:{req.session_id}"
        await redis.rpush(
            session_key,
            *[json.dumps(h) for h in history]
        )

    return {"response": ai_message}


@app.get("/ai/chat-history/{session_id}")
async def get_chat_history(session_id: str):
    redis = app.state.redis
    if not redis:
        raise HTTPException(status_code=500, detail="Redis 연결 안됨")

    session_key = f"chat_history:{session_id}"
    data = await redis.lrange(session_key, 0, -1)
    return [json.loads(item) for item in data]


# ---------------------------------
# 여행 추천 (JSON 안정화)
# ---------------------------------
class TravelRequest(BaseModel):
    count: int = 3


@app.post("/ai/recommend")
async def recommend_travel(req: TravelRequest):
    prompt = f"""
{req.count}개의 여행지를 추천하세요.

조건:
- JSON 배열만 반환
- 마크다운, ```json 금지
- 모든 값 문자열
- 따옴표 정확히 닫기

형식:
[
  {{
    "title": "string",
    "reason": "string"
  }}
]
"""

    try:
        response = await ollama.AsyncClient().generate(
            model=MODEL,
            prompt=prompt,
            options={"temperature": 0},
            keep_alive=-1
        )

        ai_output = response.get("response", "").strip()
        print("AI 원본:", ai_output)

        # 코드블록 제거
        if ai_output.startswith("```"):
            ai_output = ai_output.replace("```json", "")
            ai_output = ai_output.replace("```", "")
            ai_output = ai_output.strip()

        result = json.loads(ai_output)

        if not isinstance(result, list):
            raise ValueError("JSON 배열 아님")

        safe_list = []
        for item in result:
            safe_list.append({k: str(v) for k, v in item.items()})

        redis = app.state.redis
        if redis:
            await redis.set(
                f"travel_recommend:{req.count}",
                json.dumps(safe_list),
                ex=3600
            )

        return {"recommendations": safe_list}

    except json.JSONDecodeError as e:
        print("JSON 파싱 실패:", ai_output)
        raise HTTPException(
            status_code=500,
            detail=f"AI 출력값이 올바른 JSON이 아닙니다: {e}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"추천 생성 실패: {e}"
        )


# ---------------------------------
# Streaming
# ---------------------------------
@app.get("/ai/stream")
async def stream(prompt: str):
    return StreamingResponse(
        stream_generate(prompt),
        media_type="text/event-stream"
    )


async def stream_generate(prompt: str):
    stream = await ollama.AsyncClient().generate(
        model=MODEL,
        prompt=prompt,
        stream=True,
        keep_alive=-1
    )

    async for part in stream:
        yield part.get("response", "")


# ---------------------------------
# 실행용 (선택)
# ---------------------------------
# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
