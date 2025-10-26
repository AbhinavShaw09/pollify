from fastapi import FastAPI, Depends, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from config.database import Base, engine, get_db
from services import poll_service
from services import auth_service
from schemas import poll_schema, auth_schema
from utils.websocket_manager import ConnectionManager
from utils.dependencies import get_current_user
from models.user import User

# Import all models to ensure relationships work
from models import user, polls, vote, comment, like

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()

@app.post("/register", response_model=auth_schema.UserResponse)
def register(user: auth_schema.UserCreate, db: Session = Depends(get_db)):
    db_user = auth_service.create_user(db, user)
    if not db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    return db_user

@app.post("/login", response_model=auth_schema.LoginResponse)
def login(user: auth_schema.UserLogin, db: Session = Depends(get_db)):
    authenticated_user = auth_service.authenticate_user(db, user.username, user.password)
    if not authenticated_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = auth_service.create_user_token(authenticated_user.username)
    return {"user": authenticated_user, "access_token": access_token}

@app.post("/polls/", response_model=poll_schema.Poll)
def create_poll(poll: poll_schema.PollBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    poll_create = poll_schema.PollCreate(
        question=poll.question,
        options=poll.options,
        creator_id=current_user.id
    )
    new_poll = poll_service.create_poll(db, poll_create)
    return new_poll

@app.get("/polls/", response_model=list[poll_schema.Poll])
def read_polls(db: Session = Depends(get_db)):
    return poll_service.get_polls(db)

@app.get("/polls/{poll_id}", response_model=poll_schema.Poll)
def get_poll(poll_id: int, db: Session = Depends(get_db)):
    return poll_service.get_poll(db, poll_id)

@app.post("/polls/{poll_id}/vote")
def vote_on_poll(poll_id: int, vote_data: poll_schema.VoteBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return poll_service.vote_on_poll(db, poll_id, vote_data.option, current_user.id)

@app.get("/polls/{poll_id}/results")
def get_poll_results(poll_id: int, db: Session = Depends(get_db)):
    return poll_service.get_poll_results(db, poll_id)

@app.post("/polls/{poll_id}/comments", response_model=poll_schema.Comment)
def add_comment(poll_id: int, comment: poll_schema.CommentBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    comment_create = poll_schema.CommentCreate(
        content=comment.content,
        user_id=current_user.id
    )
    return poll_service.add_comment(db, poll_id, comment_create)

@app.get("/polls/{poll_id}/comments", response_model=list[poll_schema.Comment])
def get_comments(poll_id: int, db: Session = Depends(get_db)):
    return poll_service.get_comments(db, poll_id)

@app.get("/polls/{poll_id}/vote-status")
def check_vote_status(poll_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return poll_service.check_user_voted(db, poll_id, current_user.id)

@app.get("/polls/{poll_id}/like-status")
def check_like_status(poll_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return poll_service.check_user_liked(db, poll_id, current_user.id)

@app.post("/polls/{poll_id}/like", response_model=poll_schema.Poll)
def like_poll(poll_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = poll_service.like_poll(db, poll_id, current_user.id)
    poll = poll_service.get_poll(db, poll_id)
    return poll

@app.get("/polls/{poll_id}/likes")
def get_poll_likes(poll_id: int, db: Session = Depends(get_db)):
    return poll_service.get_poll_likes(db, poll_id)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast({"message": data})
    except Exception:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
