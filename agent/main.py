from fastapi import FastAPI

app = FastAPI(title="Sasha Store Agentic AI", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "agentic-ai-services",
        "message": "Placeholder service — agentic AI workflows will live here.",
    }
