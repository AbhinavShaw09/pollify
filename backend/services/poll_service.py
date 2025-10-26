from sqlalchemy.orm import Session
from models.polls import Poll
from models.vote import Vote
from models.comment import Comment
from models.like import Like
from schemas import poll_schema
import json

def create_poll(db: Session, poll: poll_schema.PollCreate):
    from models.user import User
    db_poll = Poll(
        question=poll.question,
        options=json.dumps(poll.options),
        creator_id=poll.creator_id
    )
    db.add(db_poll)
    db.commit()
    db.refresh(db_poll)
    
    # Get username for response
    user = db.query(User).filter(User.id == poll.creator_id).first()
    return {
        "id": db_poll.id,
        "question": db_poll.question,
        "options": json.loads(db_poll.options),
        "likes": db_poll.likes,
        "username": user.username if user else "Unknown"
    }

def get_polls(db: Session):
    from models.user import User
    polls = db.query(Poll, User.username).join(User, Poll.creator_id == User.id).all()
    
    result = []
    for poll, username in polls:
        poll_dict = {
            "id": poll.id,
            "question": poll.question,
            "options": json.loads(poll.options),
            "likes": poll.likes,
            "username": username
        }
        result.append(poll_dict)
    return result

def get_poll(db: Session, poll_id: int):
    from models.user import User
    result = db.query(Poll, User.username).join(User, Poll.creator_id == User.id).filter(Poll.id == poll_id).first()
    
    if result:
        poll, username = result
        return {
            "id": poll.id,
            "question": poll.question,
            "options": json.loads(poll.options),
            "likes": poll.likes,
            "username": username
        }
    return None

def vote_on_poll(db: Session, poll_id: int, option: str, user_id: int):
    # Check if poll exists
    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        return {"error": "Poll not found"}
    
    # Check if user already voted
    existing_vote = db.query(Vote).filter(Vote.poll_id == poll_id, Vote.user_id == user_id).first()
    if existing_vote:
        return {"error": "User already voted on this poll"}
    
    # Create new vote
    new_vote = Vote(poll_id=poll_id, option=option, user_id=user_id)
    db.add(new_vote)
    db.commit()
    
    return {"message": "Vote recorded successfully", "poll_id": poll_id, "option": option}

def get_poll_results(db: Session, poll_id: int):
    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        return {"error": "Poll not found"}
    
    votes = db.query(Vote).filter(Vote.poll_id == poll_id).all()
    options = json.loads(poll.options)
    
    results = {option: 0 for option in options}
    for vote in votes:
        if vote.option in results:
            results[vote.option] += 1
    
    return {
        "poll_id": poll_id,
        "question": poll.question,
        "results": results,
        "total_votes": len(votes),
        "likes": poll.likes
    }

def like_poll(db: Session, poll_id: int, user_id: int):
    # Check if user already liked this poll
    existing_like = db.query(Like).filter(Like.poll_id == poll_id, Like.user_id == user_id).first()
    
    if existing_like:
        # Unlike: remove like and decrement count
        db.delete(existing_like)
        poll = db.query(Poll).filter(Poll.id == poll_id).first()
        if poll and poll.likes > 0:
            poll.likes -= 1
        db.commit()
        return {"message": "Poll unliked", "liked": False}
    else:
        # Like: add like and increment count
        new_like = Like(poll_id=poll_id, user_id=user_id)
        db.add(new_like)
        poll = db.query(Poll).filter(Poll.id == poll_id).first()
        if poll:
            poll.likes += 1
        db.commit()
        return {"message": "Poll liked", "liked": True}

def add_comment(db: Session, poll_id: int, comment: poll_schema.CommentCreate):
    from models.user import User
    db_comment = Comment(
        poll_id=poll_id,
        content=comment.content,
        user_id=comment.user_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    # Get username
    user = db.query(User).filter(User.id == comment.user_id).first()
    return {
        "id": db_comment.id,
        "content": db_comment.content,
        "user_id": db_comment.user_id,
        "username": user.username if user else "Unknown",
        "created_at": db_comment.created_at
    }

def get_comments(db: Session, poll_id: int):
    from models.user import User
    comments = db.query(Comment, User.username).join(User, Comment.user_id == User.id).filter(Comment.poll_id == poll_id).order_by(Comment.created_at.desc()).all()
    
    result = []
    for comment, username in comments:
        comment_dict = {
            "id": comment.id,
            "content": comment.content,
            "user_id": comment.user_id,
            "username": username,
            "created_at": comment.created_at
        }
        result.append(comment_dict)
    return result

def check_user_voted(db: Session, poll_id: int, user_id: int):
    vote = db.query(Vote).filter(Vote.poll_id == poll_id, Vote.user_id == user_id).first()
    return {"has_voted": vote is not None, "selected_option": vote.option if vote else None}

def check_user_liked(db: Session, poll_id: int, user_id: int):
    like = db.query(Like).filter(Like.poll_id == poll_id, Like.user_id == user_id).first()
    return {"has_liked": like is not None}

def get_poll_likes(db: Session, poll_id: int):
    from models.user import User
    likes = db.query(Like, User.username).join(User, Like.user_id == User.id).filter(Like.poll_id == poll_id).all()
    
    return [{"username": username} for _, username in likes]
