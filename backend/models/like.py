from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from config.database import Base

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    __table_args__ = (UniqueConstraint('poll_id', 'user_id', name='unique_poll_user_like'),)

    poll = relationship("Poll")
    user = relationship("User")
