# 🤖 AI FAQ Assistant

An AI-powered FAQ Assistant built using the MERN Stack, integrated with Hugging Face AI for intelligent responses and conversation management.

## Features

* AI-powered question answering
* Multiple chat sessions
* Conversation history storage
* Search within conversations
* Dark mode support
* Responsive user interface
* Docker support

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### AI Integration

* Hugging Face Inference API
* Microsoft Phi-2 Model

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd ai-faq-assistant
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

## Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
HF_API_TOKEN=your_huggingface_token
HF_MODEL=microsoft/phi-2
```

## Docker Setup

```bash
docker-compose up --build
```

## API Endpoints

### Send Message

```http
POST /api/chat
```

### Get Conversations

```http
GET /api/conversations
```

### Get Sessions

```http
GET /api/conversations/sessions
```

## Project Structure

```text
backend/
frontend/
docker-compose.yml
README.md
```

## Bonus Features

* Conversation Search
* Dark Mode
* Dockerized Deployment
* Multi-Session Chat Support

## Author

Mohammad Kaif
