from pydantic import BaseModel, ConfigDict, field_validator
from typing import List
from datetime import datetime
import json

class PollBase(BaseModel):
    question: str
    options: List[str]

class PollCreate(PollBase):
    creator_id: int

class VoteBase(BaseModel):
    option: str

class VoteCreate(BaseModel):
    option: str
    user_id: int

class CommentBase(BaseModel):
    content: str

class CommentCreate(BaseModel):
    content: str
    user_id: int

class Comment(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    content: str
    user_id: int
    username: str
    created_at: datetime

class Poll(PollBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    likes: int
    username: str
    
    @field_validator('options', mode='before')
    @classmethod
    def parse_options(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v
