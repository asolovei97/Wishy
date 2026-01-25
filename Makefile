# Makefile for Wishy Monorepo

.PHONY: dev up down db-init bootstrap migrate studio

# Start development environment (ALL apps: api, web, admin, mobile)
dev:
	turbo run dev

# Start ONLY the API (Backend)
dev-api:
	cd apps/api && bun run dev

# Start Docker containers
up:
	docker-compose up -d

# Stop Docker containers
down:
	docker-compose down

# Run Prisma migrations
migrate:
	cd apps/api && bun -bun prisma migrate dev

# Run Prisma Studio
studio:
	cd apps/api && bun -bun prisma studio

seed:
	cd apps/api && bun -bun prisma db seed

# Initialize Database (Container -> Wait -> Migrate -> Seed)
db-init:
	@echo "🚀 Starting Database Initialization..."
	@make up
	@echo "⏳ Waiting for Database to be ready..."
	@sleep 5
	@echo '🔄 Generate Prisma Client...'
	@cd apps/api && bun -bun prisma generate
	@echo "🔄 Running Migrations..."
	@make migrate
	@echo "✅ Database Initialized Successfully!"

# Bootstrap entire project for development
bootstrap:
	@echo "🛠️ Bootstrapping Project..."
	@bun install
	@echo "📝 Setting up Environment Variables (copying .env.example if exists)..."
	@if [ ! -f .env ]; then cp .env.example .env 2>/dev/null || echo "No .env.example, creating empty .env"; touch .env; fi
	@if [ ! -f apps/api/.env ]; then \
		echo "DATABASE_URL=\"postgresql://wishy:password@localhost:5432/wishy_db?schema=public\"" > apps/api/.env; \
	fi
	@make db-init
	@echo "🎉 Project Ready! Run 'make dev' to start."
