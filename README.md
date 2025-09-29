# Universal AI Assistant

## Features
- Real-time web search using SerpAPI
- GPT-5 powered AI answers
- Multi-language detection & responses
- Voice input & text-to-speech output
- Frontend chat widget ready to embed in any website

## Setup

### Backend
1. cd backend
2. npm install
3. Create .env with your API keys:
   OPENAI_API_KEY=your_openai_api_key
   SERP_API_KEY=your_serpapi_key
4. Start server:
   npm start
5. Deploy on Render / Railway / Vercel.

### Frontend
1. cd frontend
2. Open chat.html in browser or embed in website
3. Update OPENAI_PROXY_URL with your deployed backend URL.
