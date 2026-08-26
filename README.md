# Loom Cognitive Education Engine

An intelligent study companion web application powered by AI, built with React and Vite. Track your learning progress, generate study materials, and optimize your revision strategy.

**Live Demo:**  [Loom Cognitive Education Engine](https://loom-cognitive-education-engine-i3d.vercel.app/)

## ✨ Features

- **Smart Dashboard** – Track your study progress and manage learning subjects
- **AI-Powered Study Tools**
  - Auto-generate summaries from study notes
  - Create targeted practice questions
  - Build interactive flashcards
- **Task & Progress Management** – Monitor revision tasks and track completion
- **Responsive Design** – Works seamlessly on desktop and mobile devices
- **Real-time Notifications** – Get instant feedback on AI operations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Local Development

```bash
# Clone and install
git clone https://github.com/Snehaxcse/Loom-Cognitive-Education-Engine
cd Loom-Cognitive-Education-Engine
npm install

# Create environment file
cp .env.example .env
# Fill in your VITE_GROQ_API_KEY if testing locally

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Environment Variables

### Frontend (`.env`)

Public at build-time, used by Vite:

- `VITE_AI_API_URL` – API endpoint (default: `/api/generate`)
- `VITE_GROQ_API_KEY` – Optional; for local testing only (starts with `gsk_`)

### Backend (Vercel Deployment)

Secret environment variables set in Vercel dashboard:

- `GROQ_API_KEY` – Your Groq API key (required in production)

**⚠️ Security:** Never commit `.env` files or API keys to GitHub.

## 📦 Tech Stack

- **Frontend:** React 18 + Vite 5
- **Styling:** CSS Modules
- **State Management:** React Context API
- **Routing:** React Router v6
- **API Client:** Axios
- **Forms:** React Hook Form + Yup validation
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Notifications:** React Toastify
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI Provider:** Groq API

## 🚀 Deploy to Vercel

This project is configured for instant deployment to Vercel:

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment**
   - In project settings, add "Environment Variables"
   - Key: `GROQ_API_KEY`
   - Value: Your actual Groq API key (keep secret)

4. **Deploy**
   - Vercel auto-deploys on GitHub push
   - Check deployment status in Vercel dashboard

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page components (Dashboard, Tasks, etc.)
├── context/          # React Context for state management
├── services/         # API service layer
├── utils/            # Helper functions
├── hooks/            # Custom React hooks
└── App.jsx
api/
├── generate.js       # Vercel serverless function for Groq AI calls
workflows/
└── ci.yml            # GitHub Actions CI/CD configuration
```

## 🔐 Security Checklist

- ✅ `.env` files in `.gitignore`
- ✅ Use `.env.example` as template for contributors
- ✅ API keys never committed to source code
- ✅ Server-side secrets in Vercel dashboard only
- ✅ `vercel.json` configured for proper routing
- ✅ GitHub Actions CI pipeline for automated testing

## 📝 API Reference

### POST `/api/generate`

Generates AI-powered study content using Groq API.

**Request Body:**

```json
{
  "prompt": "Your study request",
  "action": "summary|questions|flashcards"
}
```

**Response:**

```json
{
  "success": true,
  "data": "Generated content here"
}
```

## 🐛 Troubleshooting

| Issue                    | Solution                                                               |
| ------------------------ | ---------------------------------------------------------------------- |
| 404 on `/api/generate`   | Ensure `vercel.json` rewrites are configured                           |
| GROQ_API_KEY not working | Verify key is set in Vercel Environment Variables (not `.env`)         |
| CORS errors              | Check API endpoint in `VITE_AI_API_URL` matches your deployment domain |
| Build fails              | Run `npm install` and check Node.js version (16+)                      |

## 📚 Learn More

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Groq API Documentation](https://groq.com)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues, questions, or feature requests, please open a GitHub issue.

GitHub Pages is static hosting only, so it cannot safely keep API keys server-side.
If you use GitHub Pages, host the API elsewhere and set `VITE_AI_API_URL` to that backend URL.
