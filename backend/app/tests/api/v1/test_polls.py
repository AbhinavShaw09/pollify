import pytest
import json

def test_create_poll_success(client, auth_headers):
    response = client.post("/api/v1/polls/", 
        json={
            "question": "What's your favorite color?",
            "options": ["Red", "Blue", "Green"]
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["question"] == "What's your favorite color?"
    assert json.loads(data["options"]) == ["Red", "Blue", "Green"]

def test_create_poll_unauthorized(client):
    response = client.post("/api/v1/polls/", json={
        "question": "Test poll?",
        "options": ["Yes", "No"]
    })
    assert response.status_code == 401

def test_get_polls(client, test_poll):
    response = client.get("/api/v1/polls/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["question"] == "Test poll?"

def test_get_poll_by_id(client, test_poll):
    response = client.get(f"/api/v1/polls/{test_poll.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["question"] == "Test poll?"
    assert data["id"] == test_poll.id

def test_get_poll_not_found(client):
    response = client.get("/api/v1/polls/999")
    assert response.status_code == 404

def test_vote_on_poll(client, test_poll, auth_headers):
    response = client.post(f"/api/v1/polls/{test_poll.id}/vote",
        json={"option": "Option 1"},
        headers=auth_headers
    )
    assert response.status_code == 200

def test_vote_unauthorized(client, test_poll):
    response = client.post(f"/api/v1/polls/{test_poll.id}/vote",
        json={"option": "Option 1"}
    )
    assert response.status_code == 401

def test_get_poll_results(client, test_poll):
    response = client.get(f"/api/v1/polls/{test_poll.id}/results")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data

def test_add_comment(client, test_poll, auth_headers):
    response = client.post(f"/api/v1/polls/{test_poll.id}/comments",
        json={"content": "Great poll!"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "Great poll!"

def test_add_comment_unauthorized(client, test_poll):
    response = client.post(f"/api/v1/polls/{test_poll.id}/comments",
        json={"content": "Great poll!"}
    )
    assert response.status_code == 401

def test_get_comments(client, test_poll):
    response = client.get(f"/api/v1/polls/{test_poll.id}/comments")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_check_vote_status(client, test_poll, auth_headers):
    response = client.get(f"/api/v1/polls/{test_poll.id}/vote-status",
        headers=auth_headers
    )
    assert response.status_code == 200

def test_check_vote_status_unauthorized(client, test_poll):
    response = client.get(f"/api/v1/polls/{test_poll.id}/vote-status")
    assert response.status_code == 401

def test_check_like_status(client, test_poll, auth_headers):
    response = client.get(f"/api/v1/polls/{test_poll.id}/like-status",
        headers=auth_headers
    )
    assert response.status_code == 200

def test_check_like_status_unauthorized(client, test_poll):
    response = client.get(f"/api/v1/polls/{test_poll.id}/like-status")
    assert response.status_code == 401

def test_like_poll(client, test_poll, auth_headers):
    response = client.post(f"/api/v1/polls/{test_poll.id}/like",
        headers=auth_headers
    )
    assert response.status_code == 200

def test_like_poll_unauthorized(client, test_poll):
    response = client.post(f"/api/v1/polls/{test_poll.id}/like")
    assert response.status_code == 401

def test_get_poll_likes(client, test_poll):
    response = client.get(f"/api/v1/polls/{test_poll.id}/likes")
    assert response.status_code == 200
    data = response.json()
    assert "likes" in data
