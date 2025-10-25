from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import tempfile
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database import Base

# Create temporary database for testing
test_db = tempfile.NamedTemporaryFile(delete=False)
test_db.close()

SQLALCHEMY_TEST_DATABASE_URL = f"sqlite:///{test_db.name}"

test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def get_test_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()

def cleanup_test_db():
    os.unlink(test_db.name)
