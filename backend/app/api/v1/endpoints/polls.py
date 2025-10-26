from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....db.session import get_db
from ....api.deps import get_current_user
from ....services import poll_service
from ....schemas import poll_schema
from ....models.user import User

router = APIRouter()

@router.post("/", response_model=poll_schema.Poll)
def create_poll(poll: poll_schema.PollBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    poll_create = poll_schema.PollCreate(
        question=poll.question,
        options=poll.options,
        creator_id=current_user.id
    )
    return poll_service.create_poll(db, poll_create)

@router.get("/", response_model=list[poll_schema.Poll])
def read_polls(db: Session = Depends(get_db)):
    return poll_service.get_polls(db)

@router.get("/{poll_id}", response_model=poll_schema.Poll)
def get_poll(poll_id: int, db: Session = Depends(get_db)):
    return poll_service.get_poll(db, poll_id)

@router.post("/{poll_id}/vote")
def vote_on_poll(poll_id: int, vote_data: poll_schema.VoteBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return poll_service.vote_on_poll(db, poll_id, vote_data.option, current_user.id)

@router.get("/{poll_id}/results")
def get_poll_results(poll_id: int, db: Session = Depends(get_db)):
    return poll_service.get_poll_results(db, poll_id)

@router.post("/{poll_id}/comments", response_model=poll_schema.Comment)
def add_comment(poll_id: int, comment: poll_schema.CommentBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    comment_create = poll_schema.CommentCreate(
        content=comment.content,
        user_id=current_user.id
    )
    return poll_service.add_comment(db, poll_id, comment_create)

@router.get("/{poll_id}/comments", response_model=list[poll_schema.Comment])
def get_comments(poll_id: int, db: Session = Depends(get_db)):
    return poll_service.get_comments(db, poll_id)

@router.get("/{poll_id}/vote-status")
def check_vote_status(poll_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return poll_service.check_user_voted(db, poll_id, current_user.id)

@router.get("/{poll_id}/like-status")
def check_like_status(poll_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return poll_service.check_user_liked(db, poll_id, current_user.id)

@router.post("/{poll_id}/like", response_model=poll_schema.Poll)
def like_poll(poll_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    poll_service.like_poll(db, poll_id, current_user.id)
    return poll_service.get_poll(db, poll_id)

@router.get("/{poll_id}/likes")
def get_poll_likes(poll_id: int, db: Session = Depends(get_db)):
    return poll_service.get_poll_likes(db, poll_id)
