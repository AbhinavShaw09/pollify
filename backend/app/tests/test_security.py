import pytest
from ..core.security import verify_password, create_access_token, verify_token
import hashlib

def test_backward_compatibility_sha256():
    # Test that old SHA256 hashes still work
    password = "testpass"
    old_hash = hashlib.sha256(password.encode()).hexdigest()
    assert verify_password(password, old_hash)
    assert not verify_password("wrongpass", old_hash)

def test_access_token_creation_and_verification():
    username = "testuser"
    token = create_access_token({"sub": username})
    assert token is not None
    assert isinstance(token, str)
    
    verified_username = verify_token(token)
    assert verified_username == username

def test_invalid_token_verification():
    invalid_token = "invalid.token.here"
    result = verify_token(invalid_token)
    assert result is None
