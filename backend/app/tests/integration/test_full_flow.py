import pytest
import json

def test_full_user_flow(client):
    # Register a new user
    register_response = client.post("/api/v1/register", json={
        "username": "flowuser",
        "password": "flowpass"
    })
    assert register_response.status_code == 200
    
    # Login
    login_response = client.post("/api/v1/login", json={
        "username": "flowuser",
        "password": "flowpass"
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a poll
    poll_response = client.post("/api/v1/polls/", 
        json={
            "question": "Integration test poll?",
            "options": ["Yes", "No", "Maybe"]
        },
        headers=headers
    )
    assert poll_response.status_code == 200
    poll_id = poll_response.json()["id"]
    
    # Vote on the poll
    vote_response = client.post(f"/api/v1/polls/{poll_id}/vote",
        json={"option": "Yes"},
        headers=headers
    )
    assert vote_response.status_code == 200
    
    # Check vote status
    vote_status_response = client.get(f"/api/v1/polls/{poll_id}/vote-status",
        headers=headers
    )
    assert vote_status_response.status_code == 200
    assert vote_status_response.json()["voted"] == True
    
    # Add a comment
    comment_response = client.post(f"/api/v1/polls/{poll_id}/comments",
        json={"content": "Great integration test!"},
        headers=headers
    )
    assert comment_response.status_code == 200
    
    # Like the poll
    like_response = client.post(f"/api/v1/polls/{poll_id}/like",
        headers=headers
    )
    assert like_response.status_code == 200
    
    # Check like status
    like_status_response = client.get(f"/api/v1/polls/{poll_id}/like-status",
        headers=headers
    )
    assert like_status_response.status_code == 200
    assert like_status_response.json()["liked"] == True
    
    # Get poll results
    results_response = client.get(f"/api/v1/polls/{poll_id}/results")
    assert results_response.status_code == 200
    
    # Get comments
    comments_response = client.get(f"/api/v1/polls/{poll_id}/comments")
    assert comments_response.status_code == 200
    comments = comments_response.json()
    assert len(comments) >= 1
    assert comments[0]["content"] == "Great integration test!"

def test_websocket_endpoint(client):
    # Test WebSocket connection (basic test)
    with client.websocket_connect("/ws") as websocket:
        websocket.send_text("test message")
        # WebSocket should accept the connection
        assert True  # If we get here, connection was successful
