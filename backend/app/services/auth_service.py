from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.auth_schema import UserCreate
from ..core.security import get_password_hash, verify_password, create_access_token

def create_user(db: Session, user: UserCreate):
    # Check if user already exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        return None
    
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if user and verify_password(password, user.password):
        return user
    return None

def create_user_token(username: str):
    return create_access_token(data={"sub": username})
