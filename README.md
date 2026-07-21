# Cursorline

AI-powered coding assistant with real-time streaming chat, conversation management, and an admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand |
| Backend | Laravel 9, PHP 8, MySQL, Laravel Sanctum |
| AI | Groq (llama-3.3-70b-versatile) |
| Payments | Stripe |

## Requirements

- PHP ^8.0.2
- Composer
- Node.js ^18
- MySQL
- XAMPP / Laravel Herd / Valet (or any PHP server)

## Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd cursorline
```

### 2. Database

Open phpMyAdmin (`http://localhost/phpmyadmin`) and import `Backend/database/setup.sql`. This creates the `cursorline` database with all tables and seed data.

### 3. Backend

```bash
cd Backend

composer install

cp .env.example .env    # or create .env manually (see Environment Variables below)
php artisan key:generate
```

Set your database credentials, AI provider API keys, and other env vars in `.env`.

Create the storage symlink for avatar uploads:

```bash
php artisan storage:link
```

Start the server:

```bash
php artisan serve
```

The API runs at `http://localhost:8000`.

### 4. Frontend

```bash
cd Frontend

npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment Variables

### Backend `.env`

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host (default: `127.0.0.1`) |
| `DB_PORT` | MySQL port (default: `3306`) |
| `DB_DATABASE` | Database name (`cursorline`) |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `GROQ_API_KEY` | Groq API key |
| `GROQ_MODEL` | Groq model (default: `llama-3.3-70b-versatile`) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `FRONTEND_URL` | Frontend URL (default: `http://localhost:5173`) |

### Frontend `.env`

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

## Default Admin Account

After importing the database, log in with:

- **Email:** `admin@cursorline.dev`
- **Password:** `password`

## Project Structure

```
cursorline/
├── Backend/                 # Laravel API
│   ├── app/
│   │   ├── Console/Commands/    # AI provider selection command
│   │   ├── Contracts/Services/  # Service interfaces
│   │   ├── Http/Controllers/    # API controllers
│   │   ├── Models/              # Eloquent models
│   │   └── Services/            # Business logic
│   ├── database/setup.sql       # Full DB setup + seed data
│   └── routes/api.php           # API routes
│
├── Frontend/                # React SPA
│   ├── src/
│   │   ├── components/          # Shared components
│   │   ├── hooks/               # Custom hooks
│   │   ├── pages/               # Route pages
│   │   │   ├── admin/           # Admin dashboard pages
│   │   │   └── ...              # Public pages
│   │   ├── stores/              # Zustand stores
│   │   └── lib/                 # Utilities (axios, etc.)
│   └── package.json
│
└── README.md
```

## License

Private
