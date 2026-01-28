# BagsHub

The ultimate hub for Bags tokens on Solana. Launch tokens, track trending coins, research with AI, and engage with the community.

## Features

- **Token Launcher** - Create tokens with custom functions via Bags API
- **Trending Dashboard** - Display top tokens with real-time data
- **Token Detail Pages** - Charts, holder distribution, stats, transaction history
- **Search & Discovery** - Fast token search functionality
- **AI Coin Researcher** - Deep research tool using Claude API
- **New Launches Feed** - Real-time stream of newly created tokens
- **Per-Token Chat Rooms** - Real-time messaging with emoji reactions
- **Leaderboards** - Top gainers/losers, most volume, newest, most holders
- **Categories & Tags** - Filter system for meme coins, AI tokens, gaming tokens
- **Bookmarks/Favorites** - Personal watchlists

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn-style components
- **State/Data**: TanStack Query
- **Database**: PostgreSQL + Prisma
- **Auth**: JWT (username/password)
- **Real-time**: Socket.io
- **AI**: Anthropic Claude API

## Project Structure

```
bagshub/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # API routes (Bags proxy)
│   │   │   ├── auth/          # Auth endpoints
│   │   │   └── tokens/        # Token endpoints
│   │   ├── token/[mint]/      # Token detail page
│   │   ├── launch/            # Token launcher
│   │   ├── trending/          # Trending tokens
│   │   ├── leaderboards/      # Leaderboard views
│   │   ├── research/          # AI research tool
│   │   ├── bookmarks/         # User watchlist
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── layout/            # Navbar, Sidebar
│   │   ├── tokens/            # TokenCard, TokenGrid
│   │   ├── search/            # SearchModal
│   │   ├── auth/              # AuthModal
│   │   ├── chat/              # Chat components
│   │   └── ui/                # Button, Input, Card, Badge
│   ├── contexts/
│   │   └── auth-context.tsx   # Auth state management
│   ├── data/
│   │   └── mock-tokens.ts     # Mock data for development
│   ├── hooks/                 # Custom React hooks
│   ├── lib/
│   │   ├── bags-api.ts        # Bags API client (server-side)
│   │   ├── auth.ts            # Auth utilities
│   │   ├── db.ts              # Prisma client
│   │   └── utils.ts           # Helper functions
│   └── types/
│       ├── index.ts           # App types
│       └── api.ts             # Bags API types
├── .env.example               # Environment variables template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Bags API key (get from [dev.bags.fm](https://dev.bags.fm))
- Anthropic API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bagshub.git
cd bagshub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
BAGS_API_KEY=your_bags_api_key
BAGS_API_URL=https://public-api-v2.bags.fm/api/v1
DATABASE_URL=postgresql://user:password@localhost:5432/bagshub
JWT_SECRET=your_jwt_secret_min_32_chars
ANTHROPIC_API_KEY=your_anthropic_api_key
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Bags API Integration

All Bags API calls are proxied through Next.js API routes to:
- Hide API keys from the frontend
- Implement rate limiting and caching
- Transform data for the UI

### Rate Limits
- 1,000 requests/hour per user and IP
- Check `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers

### Key Endpoints Used
- `GET /tokens` - List tokens with filters
- `GET /tokens/:mint` - Token details
- `GET /tokens/:mint/holders` - Holder distribution
- `GET /tokens/:mint/transactions` - Transaction history
- `POST /tokens` - Create new token
- `POST /upload` - Upload token image

Full documentation: [docs.bags.fm](https://docs.bags.fm/)

## Development Roadmap

### Phase 1: Core UI (Current)
- [x] Project setup & architecture
- [x] Token card & grid components
- [x] Main dashboard
- [x] Token detail page
- [x] Search functionality
- [x] Auth system (login/register)
- [x] Token launcher form

### Phase 2: API Integration
- [ ] Connect to Bags API
- [ ] Real-time price updates
- [ ] Price charts integration
- [ ] Transaction history

### Phase 3: Social Features
- [ ] Per-token chat rooms
- [ ] Emoji reactions
- [ ] User profiles
- [ ] Bookmarks/watchlists

### Phase 4: Advanced Features
- [ ] AI token research
- [ ] Categories & tags
- [ ] Notifications
- [ ] Mobile optimization

## License

MIT
