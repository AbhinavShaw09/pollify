import pytest
from fastapi.testclient import TestClient

def test_register_success(client):
    response = client.post("/api/v1/register", json={
        "username": "newuser",
        "password": "newpass"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newuser"
    assert "id" in data

def test_register_duplicate_username(client, test_user):
    response = client.post("/api/v1/register", json={
        "username": "testuser",
        "password": "newpass"
    })
    assert response.status_code == 400
    assert "Username already exists" in response.json()["detail"]

def test_login_success(client, test_user):
    response = client.post("/api/v1/login", json={
        "username": "testuser",
        "password": "testpass"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "testuser"

def test_login_invalid_credentials(client):
    response = client.post("/api/v1/login", json={
        "username": "nonexistent",
        "password": "wrongpass"
    })
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]

def test_login_wrong_password(client, test_user):
    response = client.post("/api/v1/login", json={
        "username": "testuser",
        "password": "wrongpass"
    })
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]
