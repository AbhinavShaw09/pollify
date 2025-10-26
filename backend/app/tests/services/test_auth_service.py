import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.services.auth_service import create_user, authenticate_user, create_user_token
from app.schemas.auth_schema import UserCreate

def test_create_user_success(db_session):
    user_data = UserCreate(username="newuser", password="password123")
    user = create_user(db_session, user_data)
    assert user is not None
    assert user.username == "newuser"
    assert user.id is not None

def test_create_user_duplicate(db_session, test_user):
    user_data = UserCreate(username="testuser", password="password123")
    user = create_user(db_session, user_data)
    assert user is None

def test_authenticate_user_success(db_session, test_user):
    user = authenticate_user(db_session, "testuser", "testpass")
    assert user is not None
    assert user.username == "testuser"

def test_authenticate_user_wrong_password(db_session, test_user):
    user = authenticate_user(db_session, "testuser", "wrongpass")
    assert user is None

def test_authenticate_user_nonexistent(db_session):
    user = authenticate_user(db_session, "nonexistent", "password")
    assert user is None

def test_create_user_token():
    token = create_user_token("testuser")
    assert token is not None
    assert isinstance(token, str)
    assert len(token) > 0
