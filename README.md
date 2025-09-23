<div align="center">

# Dream Job

### AI-Powered Job Search Tool

*Intelligently analyzes user preferences and scrapes job listings to find the perfect career opportunities*

[![License](https://img.shields.io/badge/License-BSL%201.1-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-v15+-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v17+-blue.svg)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-enabled-blue.svg)](https://docker.com/)

[✨ Features](#features) • [🚀 Quick Start](#quick-start) • [📖 Configuration](#configuration) • [🤝 Contributing](#contributing)

</div>

---

## Features

<table>
  <tr>
    <td><strong>AI-Powered Analysis</strong></td>
    <td>Uses any AI service (OpenAI, Gemini) to extract job preferences from natural language</td>
  </tr>
  <tr>
    <td><strong>Smart Job Scraping</strong></td>
    <td>Automated scraping from popular job boards (ZipRecruiter, Indeed, and more)</td>
  </tr>
  <tr>
    <td><strong>Intelligent Ranking</strong></td>
    <td>AI-driven job ranking based on user preferences and requirements</td>
  </tr>
  <tr>
    <td><strong>Modern Interface</strong></td>
    <td>Built with Next.js and React for a seamless user experience</td>
  </tr>
  <tr>
    <td><strong>Database Integration</strong></td>
    <td>PostgreSQL with Prisma ORM for efficient data management</td>
  </tr>
</table>

## Tech Stack

### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![Playwright](https://img.shields.io/badge/-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)

### Frontend
![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

### DevOps
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/-Docker%20Compose-2496ED?style=flat-square&logo=docker&logoColor=white)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- AI Provider API key

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/afnx/dream-job.git
cd dream-job
```

### 2. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```bash
# Project Configuration
ENV=dev

# Backend Configuration
NODE_PORT=5000
NODE_HOST=localhost
NODE_API_PREFIX=/api
NODE_API_VERSION=v1

# Database Configuration
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=postgres_user
DATABASE_PASSWORD=postgres_password
DATABASE_NAME=dream_job_db
DATABASE_URL="postgresql://postgres_user:postgres_password@db:5432/dream_job_db?schema=public"

# AI Configuration
AI_PROVIDER=openai
AI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-3.5-turbo

# Frontend Configuration
NEXT_JS_PORT=3000
NEXT_JS_HOST=localhost
```

### 3. Docker Setup

Start all services with Docker Compose:

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

> 🎉 **That's it!** Your Dream Job application should now be running at `http://localhost:3000`

## Configuration

### AI Provider Setup

<details>
<summary><strong>OpenAI Setup</strong></summary>

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add your API key to the `.env` file:
   ```bash
   AI_PROVIDER=openai
   AI_API_KEY=your-api-key-here
   AI_MODEL=gpt-3.5-turbo
   ```

</details>

### Database Configuration

The project uses PostgreSQL with Prisma ORM. Database schema is located in [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# View database in browser
npx prisma studio
```

## Testing

| Component | Command | Description |
|-----------|---------|-------------|
| **Backend** | `npm test` | Run all backend tests |
| **Frontend** | `npm test` | Run all frontend tests |
| **Coverage** | `npm run test:coverage` | Generate coverage report |
| **Watch** | `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
dream-job/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── services/         # Business logic
│   │   │   ├── ai/           # AI service implementations
│   │   │   ├── scraper/      # Web scraping services
│   │   │   └── job/          # Job-related services
│   │   ├── repositories/     # Data access layer
│   │   ├── utils/            # Utility functions
│   │   ├── middleware/       # Express middleware
│   │   └── routes/           # API routes
│   ├── __tests__/            # Test files
│   └── prisma/               # Database schema & migrations
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # React components
│   │   └── hooks/            # Custom React hooks
│   └── public/               # Static assets
└── compose.yaml              # Container orchestration
```

## Supported Platforms

### Job Boards
| Platform | Status | Notes |
|----------|--------|-------|
| **ZipRecruiter** | ✅ Active | Full scraping support |
| **Indeed** | 🚧 In Development |  |

### AI Services
| Service | Status | Models |
|---------|--------|---------|
| **OpenAI** | ✅ Active | GPT-3.5, GPT-4 |
| **Gemini** | 🔜 Coming Soon | Pro, Ultra |


## Contributing

We welcome contributions from developers of all skill levels! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Backend**: ESLint configuration in [`backend/eslint.config.js`](backend/eslint.config.js)
- **Frontend**: ESLint configuration in [`frontend/eslint.config.mjs`](frontend/eslint.config.mjs)

## Troubleshooting

<details>
<summary><strong>AI Provider API Errors</strong></summary>

- ✅ Verify your API key is correct
- ✅ Check your AI provider account has sufficient credits  
- ✅ Ensure the model name is correct

</details>

<details>
<summary><strong>Database Connection Issues</strong></summary>

- ✅ Verify PostgreSQL is running
- ✅ Check database credentials in `.env`
- ✅ Run `npx prisma generate` after schema changes

</details>

<details>
<summary><strong>Scraping Issues</strong></summary>

- ✅ Some sites may block requests (rate limiting)
- ✅ Playwright may need browser installation: `npx playwright install`

</details>

### View Logs

```bash
# View backend logs
docker compose logs backend

# View frontend logs  
docker compose logs frontend

# View all logs
docker compose logs -f
```

---

## License

This project is licensed under the **Business Source License 1.1** - see the [LICENSE](LICENSE) file for details.

## Authors

- **Ali Fuat Numanoglu** - *Initial work* - [@afnx](https://github.com/afnx)

## Support

- 🐛 [Report Issues](https://github.com/afnx/dream-job/issues)
- 📧 [Contact Me](https://alifuatnumanoglu.com/contact)
- ⭐ **If this project helped you, please give it a star!**

---

<sub>Made with ❤️ by Ali Fuat Numanoglu</sub>
