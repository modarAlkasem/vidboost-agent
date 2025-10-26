# 🎬 VidBoost AI Agent

> AI-Powered Video Content Optimizer for YouTube Creators

An intelligent conversational platform that empowers YouTube creators to optimize their content through AI-driven analysis and generation. Chat with an AI agent to generate SEO-optimized titles, scripts, and thumbnails—all in real-time.

---

## 🎥 Demo

Watch a quick demo of the AI agent in action.

<div align="center">
  <a href="docs/images/vidboost-agent.gif" target="_blank" rel="noopener">
    <img src="docs/images/vidboost-agent.gif" alt="VidBoost AI Agent Demo" width="70%">
  </a>
</div>


<!-- <div align="center">
  <img src="docs/images/home.png" alt="AI Chat Interface" width="45%">
  <img src="docs/images/video-analysis-left-section.png" alt="Video Analysis" width="45%">
</div>

<div align="center">
  <img src="docs/images/title-generation.png" alt="Title Generation" width="45%">
  <img src="docs/images/thumbnail-preview.png" alt="Thumbnail Preview" width="45%">
</div> -->

---

## ✨ Features

### 🤖 **AI-Powered Conversational Interface**
- Real-time streaming responses (ChatGPT-like experience)
- Context-aware video analysis
- Multi-tool agent system with LangChain

### 🎯 **Content Generation**
- **Titles**: SEO-optimized (50-60 chars) using Groq LLM
- **Scripts**: Video scripts based on transcript analysis
- **Thumbnails**: AI-generated concepts via HuggingFace/Replicate

### ⚡ **Performance**
- WebSocket streaming for instant responses
- Async-first architecture
- Background task processing with Celery
- Reduces optimization time from 2+ hours to < 10 minutes

---

## 🏗️ Architecture
```
                                      ┌──────────────────┐
                                      │    Next.js UI    │───────────────────────┐
                                      │   (TypeScript)   │                       │
                                      └─────────│────────┘                       │
                                                │                                │
                                                │ WebSocket                      │
                                      ┌────────▼─────────┐                       │ 
                                      │  Django Channels │                       │ HTTP
                                      │    (WebSocket)   │                       │ 
                                      └──────────────────┘                       │
                                                │                                │ 
                    ┌───────────────────────────┼───────────────────────┐        │ 
                    │                           │                       │        │ 
          ┌─────────▼───────┐       ┌───────────▼───────┐  ┌────────────▼─────┐  │
          │  LangChain Agent│       │  Celery Workers  │   │  Django REST API │  │
          │  (Gemini/Groq)  │       │  (Video Fetch)   │   │    (JWT Auth)    │──┘
          └─────────────────┘       └──────────────────┘   └──────────────────┘
                    │                           │                     │
          ┌─────────▼───────────────────────────▼─────────────────────▼────────┐
          │                          PostgreSQL + Redis                        │
          └────────────────────────────────────────────────────────────────────┘
```

**Key Components:**
- **Frontend**: Next.js 15, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Django 5.2, DRF, Django Channels (WebSocket)
- **AI Layer**: LangChain, Google Gemini, Groq LLM, HuggingFace/Replicate
- **Task Queue**: Celery + Redis
- **Database**: PostgreSQL
- **Storage**: AWS S3 (private buckets)
- **Deployment**: Docker + Docker Compose

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+

### Backend Setup
```bash
# Clone repository
git clone https://github.com/modarAlkasem/vidboost-ai-agent.git
cd vidboost-ai-agent/backend

# Create .env file
cp .env.example .env
# Add your API keys (Google Gemini, Groq, AWS, etc.)

# Start services
docker-compose -f docker/docker-compose.yml up -d

# Run migrations
docker-compose exec api python manage.py migrate
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
# Add NEXT_PUBLIC_API_URL and other variables

# Start development server
npm run dev
```

Visit: `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend (.env)
```bash
SECRET_KEY=your-secret-key
GOOGLE_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
HUGGINGFACE_API_KEY=your-hf-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-bucket
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

---

## 💡 Key Innovations

### Multi-LLM Strategy
- **Google Gemini**: Conversational intelligence, context understanding
- **Groq**: High-speed title generation (specialized task)
- Demonstrates optimal LLM selection based on use case

### Real-Time Architecture
- WebSocket streaming for token-by-token responses
- Async patterns throughout (Django async views, Celery tasks)
- Scales efficiently with event-driven design

### Enterprise Security
- JWT authentication with custom WebSocket middleware
- Private S3 buckets with presigned URLs
- Token rotation and blacklisting

---

## 📝 API Endpoints
```bash
# Authentication
POST   /api/auth/signup/
POST   /api/auth/signin/
POST   /api/auth/token/refresh/

# Videos
POST   /api/videos/                             # Add video
GET    /api/videos/{id}/titles/                 # Get Titles
GET    /api/videos/{id}/images/                 # Get Images
WS     /ws/videos/{video_id}/                   # WebSocket video analysis

# Chat
POST   /api/chat/sessions/                      # Create chat session
GET    /api/chat/sessions/{id}/messages/        # Get chat history
WS     /ws/chat/{session_id}/                   # WebSocket chat stream
```

<!-----

## 🧪 Testing
```bash
# Backend tests
docker-compose exec api pytest

# Frontend tests
cd frontend
npm test

# E2E tests
npx playwright test
```
-->

---

## 📦 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Django 5.2, Django REST Framework, Django Channels |
| **Frontend** | Next.js 14, TypeScript, TailwindCSS, shadcn/ui |
| **AI/ML** | LangChain, Google Gemini, Groq, HuggingFace, Replicate |
| **Database** | PostgreSQL |
| **Cache/Queue** | Redis, Celery |
| **Storage** | AWS S3 |
| **Auth** | NextAuth.js, JWT |
| **DevOps** | Docker, Docker Compose |

---

## 🎯 Roadmap

### ✅ Completed
- [x] Real-time AI chat with streaming
- [x] Video transcript analysis
- [x] AI title generation (Groq)
- [x] AI thumbnail generation
- [x] JWT authentication
- [x] WebSocket chat interface
- [x] Docker deployment

### 🔜 Coming Soon
- [ ] **Payment Integration** (Stripe) with feature flags

---

## ⚠️ Project Status

**Status**: ✅ Fully functional

The platform is production-ready with all core features implemented. The only pending module is the **payment system** (Stripe integration with feature flags), which will be added in the next release.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👨‍💻 Author

**Mudar Alkasem**
- LinkedIn: [modar-alkasem](https://linkedin.com/in/modar-alkasem)
- GitHub: [@modarAlkasem](https://github.com/modarAlkasem)

---

## 🙏 Acknowledgments

- Google Gemini for conversational AI
- Groq for Title Generation
- LangChain for agent orchestration
- HuggingFace & Replicate for image generation

---

<div align="center">
  <strong>Built with ❤️ for content creators</strong>
</div>