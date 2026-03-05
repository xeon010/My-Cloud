# MyCloud

> Self-hosted cloud storage - take back ownership of your data.

An open-source, full-stack cloud storage application you can run on any machine.
Upload, organize, and access your files privately without relying on third-party cloud providers.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend API | FastAPI (Python) |
| Database | PostgreSQL |
| Object Storage | MinIO |
| Containers | Docker + Docker Compose |

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) installed and running

### Run locally

```bash
git clone https://github.com/xeon010/My-Cloud.git
cd My-Cloud
docker compose up --build
```

| Service | URL |
|---|---|
| App | http://localhost:5001 |
| API | http://localhost:8000 |
| MinIO Dashboard | http://localhost:9001 |

---

## Project Structure

```
/
├── frontend/        # React + Vite
├── backend/         # FastAPI
│   ├── models/      # SQLAlchemy DB models
│   ├── routers/     # API route handlers
│   ├── database.py  # PostgreSQL connection
│   └── storage.py   # MinIO client
└── docker-compose.yml
```
