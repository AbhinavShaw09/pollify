import pytest
import json
from ...services import poll_service
from ...schemas.poll_schema import PollCreate, CommentCreate

def test_create_poll(db_session, test_user):
    poll_data = PollCreate(
        question="Test question?",
        options=["Yes", "No"],
        creator_id=test_user.id
    )
    poll = poll_service.create_poll(db_session, poll_data)
    assert poll is not None
    assert poll.question == "Test question?"
    assert json.loads(poll.options) == ["Yes", "No"]

def test_get_polls(db_session, test_poll):
    polls = poll_service.get_polls(db_session)
    assert len(polls) >= 1
    assert polls[0].question == "Test poll?"

def test_get_poll(db_session, test_poll):
    poll = poll_service.get_poll(db_session, test_poll.id)
    assert poll is not None
    assert poll.question == "Test poll?"

def test_vote_on_poll(db_session, test_poll, test_user):
    result = poll_service.vote_on_poll(db_session, test_poll.id, "Option 1", test_user.id)
    assert result["message"] == "Vote recorded successfully"

def test_get_poll_results(db_session, test_poll):
    results = poll_service.get_poll_results(db_session, test_poll.id)
    assert "results" in results

def test_add_comment(db_session, test_poll, test_user):
    comment_data = CommentCreate(content="Great poll!", user_id=test_user.id)
    comment = poll_service.add_comment(db_session, test_poll.id, comment_data)
    assert comment is not None
    assert comment.content == "Great poll!"

def test_get_comments(db_session, test_poll):
    comments = poll_service.get_comments(db_session, test_poll.id)
    assert isinstance(comments, list)

def test_check_user_voted(db_session, test_poll, test_user):
    result = poll_service.check_user_voted(db_session, test_poll.id, test_user.id)
    assert "voted" in result

def test_check_user_liked(db_session, test_poll, test_user):
    result = poll_service.check_user_liked(db_session, test_poll.id, test_user.id)
    assert "liked" in result

def test_like_poll(db_session, test_poll, test_user):
    result = poll_service.like_poll(db_session, test_poll.id, test_user.id)
    assert result["message"] in ["Poll liked successfully", "Poll unliked successfully"]

def test_get_poll_likes(db_session, test_poll):
    result = poll_service.get_poll_likes(db_session, test_poll.id)
    assert "likes" in result
