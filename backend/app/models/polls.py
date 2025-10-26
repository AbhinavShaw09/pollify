from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..db.session import Base

class Poll(Base):
    __tablename__ = "polls"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    options = Column(String, nullable=False)  # store as JSON string
    creator_id = Column(Integer, ForeignKey("users.id"))
    likes = Column(Integer, default=0)

    creator = relationship("User", back_populates="polls")
    comments = relationship("Comment", back_populates="poll")
