import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import json
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app, get_db
from .test_config import get_test_db, test_engine, cleanup_test_db
from config.database import Base
import models

# Override dependency
app.dependency_overrides[get_db] = get_test_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # Create tables
    Base.metadata.create_all(bind=test_engine)
    yield
    # Cleanup
    Base.metadata.drop_all(bind=test_engine)
    cleanup_test_db()

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def sample_poll_data():
    return {
        "question": "What's your favorite programming language?",
        "options": ["Python", "JavaScript", "Java", "Go"],
        "creator_id": 1
    }

class TestPollAPI:
    
    def test_create_poll(self, client, sample_poll_data):
        """Test creating a new poll"""
        response = client.post("/polls/", json=sample_poll_data)
        assert response.status_code == 200
        data = response.json()
        assert data["question"] == sample_poll_data["question"]
        assert data["id"] is not None
        assert data["likes"] == 0
        return data["id"]
    
    def test_get_all_polls(self, client, sample_poll_data):
        """Test getting all polls"""
        # Create a poll first
        client.post("/polls/", json=sample_poll_data)
        
        response = client.get("/polls/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
    
    def test_get_specific_poll(self, client, sample_poll_data):
        """Test getting a specific poll by ID"""
        # Create a poll first
        create_response = client.post("/polls/", json=sample_poll_data)
        poll_id = create_response.json()["id"]
        
        response = client.get(f"/polls/{poll_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == poll_id
        assert data["question"] == sample_poll_data["question"]
    
    def test_get_nonexistent_poll(self, client):
        """Test getting a poll that doesn't exist"""
        response = client.get("/polls/99999")
        assert response.status_code == 404
        assert "Poll not found" in response.json()["detail"]
    
    def test_vote_on_poll(self, client, sample_poll_data):
        """Test voting on a poll"""
        # Create a poll first
        create_response = client.post("/polls/", json=sample_poll_data)
        poll_id = create_response.json()["id"]
        
        vote_data = {"option": "Python", "user_id": 1}
        response = client.post(f"/polls/{poll_id}/vote", json=vote_data)
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Vote recorded successfully"
        assert data["poll_id"] == poll_id
        assert data["option"] == "Python"
    
    def test_duplicate_vote(self, client, sample_poll_data):
        """Test that users can't vote twice on the same poll"""
        # Create a poll first
        create_response = client.post("/polls/", json=sample_poll_data)
        poll_id = create_response.json()["id"]
        
        vote_data = {"option": "Python", "user_id": 1}
        
        # First vote should succeed
        response1 = client.post(f"/polls/{poll_id}/vote", json=vote_data)
        assert response1.status_code == 200
        
        # Second vote should fail
        response2 = client.post(f"/polls/{poll_id}/vote", json=vote_data)
        assert response2.status_code == 200
        data = response2.json()
        assert "already voted" in data["error"]
    
    def test_vote_on_nonexistent_poll(self, client):
        """Test voting on a poll that doesn't exist"""
        vote_data = {"option": "Python", "user_id": 1}
        response = client.post("/polls/99999/vote", json=vote_data)
        assert response.status_code == 200
        data = response.json()
        assert "Poll not found" in data["error"]
    
    def test_like_poll(self, client, sample_poll_data):
        """Test liking a poll"""
        # Create a poll first
        create_response = client.post("/polls/", json=sample_poll_data)
        poll_id = create_response.json()["id"]
        
        response = client.post(f"/polls/{poll_id}/like")
        assert response.status_code == 200
        data = response.json()
        assert data["likes"] == 1
        
        # Like again to test increment
        response2 = client.post(f"/polls/{poll_id}/like")
        assert response2.status_code == 200
        data2 = response2.json()
        assert data2["likes"] == 2
    
    def test_like_nonexistent_poll(self, client):
        """Test liking a poll that doesn't exist"""
        response = client.post("/polls/99999/like")
        assert response.status_code == 404
        assert "Poll not found" in response.json()["detail"]
    
    def test_get_poll_results(self, client, sample_poll_data):
        """Test getting poll results"""
        # Create a poll first
        create_response = client.post("/polls/", json=sample_poll_data)
        poll_id = create_response.json()["id"]
        
        # Add some votes
        client.post(f"/polls/{poll_id}/vote", json={"option": "Python", "user_id": 1})
        client.post(f"/polls/{poll_id}/vote", json={"option": "Python", "user_id": 2})
        client.post(f"/polls/{poll_id}/vote", json={"option": "JavaScript", "user_id": 3})
        
        # Like the poll
        client.post(f"/polls/{poll_id}/like")
        
        response = client.get(f"/polls/{poll_id}/results")
        assert response.status_code == 200
        data = response.json()
        
        assert data["poll_id"] == poll_id
        assert data["question"] == sample_poll_data["question"]
        assert data["total_votes"] == 3
        assert data["results"]["Python"] == 2
        assert data["results"]["JavaScript"] == 1
        assert data["results"]["Java"] == 0
        assert data["results"]["Go"] == 0
        assert data["likes"] == 1
    
    def test_get_results_nonexistent_poll(self, client):
        """Test getting results for a poll that doesn't exist"""
        response = client.get("/polls/99999/results")
        assert response.status_code == 200
        data = response.json()
        assert "Poll not found" in data["error"]

class TestWebSocket:
    
    def test_websocket_connection(self, client):
        """Test WebSocket connection"""
        with client.websocket_connect("/ws") as websocket:
            websocket.send_text("Hello WebSocket")
            # Note: In a real test, you'd test the broadcast functionality

class TestIntegration:
    
    def test_complete_poll_workflow(self, client):
        """Test complete poll workflow from creation to results"""
        # 1. Create poll
        poll_data = {
            "question": "Best web framework?",
            "options": ["FastAPI", "Django", "Flask"],
            "creator_id": 1
        }
        create_response = client.post("/polls/", json=poll_data)
        assert create_response.status_code == 200
        poll_id = create_response.json()["id"]
        
        # 2. Multiple users vote
        votes = [
            {"option": "FastAPI", "user_id": 1},
            {"option": "FastAPI", "user_id": 2},
            {"option": "Django", "user_id": 3},
            {"option": "Flask", "user_id": 4},
            {"option": "FastAPI", "user_id": 5}
        ]
        
        for vote in votes:
            response = client.post(f"/polls/{poll_id}/vote", json=vote)
            assert response.status_code == 200
        
        # 3. Like the poll multiple times
        for _ in range(3):
            client.post(f"/polls/{poll_id}/like")
        
        # 4. Check final results
        results_response = client.get(f"/polls/{poll_id}/results")
        assert results_response.status_code == 200
        results = results_response.json()
        
        assert results["total_votes"] == 5
        assert results["results"]["FastAPI"] == 3
        assert results["results"]["Django"] == 1
        assert results["results"]["Flask"] == 1
        assert results["likes"] == 3
        
        # 5. Verify poll appears in all polls list
        all_polls_response = client.get("/polls/")
        assert all_polls_response.status_code == 200
        all_polls = all_polls_response.json()
        
        poll_found = any(poll["id"] == poll_id for poll in all_polls)
        assert poll_found
