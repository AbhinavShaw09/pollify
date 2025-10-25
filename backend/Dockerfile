FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml ./
RUN pip install poetry && poetry config virtualenvs.create false
RUN poetry install --only=main --no-root

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]
