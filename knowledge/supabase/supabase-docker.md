# Supabase Docker Setup Guide

**Purpose:** Complete guide for setting up Supabase CLI with Docker on Linux  
**Last Updated:** 2025-01-23  
**Supabase CLI Version:** 2.72.7

---

## 🔍 Problem Diagnosis

### Current Issue

**Symptoms:**
- `supabase start` fails with Docker connectivity errors
- `supabase_vector_startupai16` container shows "unhealthy" status
- Error: `Connection refused (os error 111)` when vector container tries to connect to Docker daemon
- Docker daemon not accessible at `/home/sk/.docker/desktop/docker.sock`

**Root Cause:**
1. **Docker Desktop not running** - Docker daemon is not active
2. **Socket path mismatch** - Supabase CLI expects Docker socket at standard location
3. **Vector container dependency** - Analytics service requires Docker socket access for log collection

---

## ✅ Prerequisites

### Required Software

1. **Docker Desktop (Linux)** or **Docker Engine**
   ```bash
   # Check if Docker is installed
   docker --version
   
   # Check if Docker daemon is running
   docker ps
   ```

2. **Supabase CLI** (v2.72.7+)
   ```bash
   # Install via npm (recommended)
   npm install -g supabase
   
   # Or via Homebrew
   brew install supabase/tap/supabase
   
   # Verify installation
   supabase --version
   ```

3. **Git** (for cloning Supabase repo if needed)
   ```bash
   git --version
   ```

### System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 4 GB | 8 GB+ |
| CPU | 2 cores | 4 cores+ |
| Disk | 50 GB SSD | 80 GB+ SSD |

---

## 🚀 Setup Steps

### Step 1: Install Docker Desktop (Linux)

**Option A: Docker Desktop (Recommended for Development)**

1. **Download Docker Desktop:**
   ```bash
   # Visit: https://docs.docker.com/desktop/install/linux-install/
   # Or use package manager
   wget https://desktop.docker.com/linux/main/amd64/docker-desktop-*.deb
   ```

2. **Install:**
   ```bash
   sudo apt-get update
   sudo apt-get install ./docker-desktop-*.deb
   ```

3. **Start Docker Desktop:**
   ```bash
   # Launch Docker Desktop from applications menu
   # Or via command line
   systemctl --user start docker-desktop
   ```

4. **Verify Docker is running:**
   ```bash
   docker ps
   # Should show empty list or running containers (not an error)
   ```

**Option B: Docker Engine (For Servers)**

```bash
# Install Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group (avoid sudo)
sudo usermod -aG docker $USER

# Log out and back in, then verify
docker ps
```

### Step 2: Configure Docker Socket Access

**For Docker Desktop:**

The socket is typically at `/home/$USER/.docker/desktop/docker.sock`. Ensure:

1. **Socket exists:**
   ```bash
   ls -la ~/.docker/desktop/docker.sock
   ```

2. **Set correct permissions:**
   ```bash
   sudo chmod 666 ~/.docker/desktop/docker.sock
   # Or add user to docker group
   sudo usermod -aG docker $USER
   ```

3. **Set DOCKER_HOST environment variable (if needed):**
   ```bash
   export DOCKER_HOST=unix://$HOME/.docker/desktop/docker.sock
   # Add to ~/.bashrc or ~/.zshrc for persistence
   echo 'export DOCKER_HOST=unix://$HOME/.docker/desktop/docker.sock' >> ~/.bashrc
   ```

**For Docker Engine:**

Socket is at `/var/run/docker.sock`:

```bash
# Ensure user is in docker group
sudo usermod -aG docker $USER

# Log out and back in
# Verify access
docker ps
```

### Step 3: Initialize Supabase Project

```bash
# Navigate to your project directory
cd /home/sk/startupai16

# Initialize Supabase (if not already done)
supabase init

# This creates:
# - supabase/config.toml (configuration)
# - supabase/migrations/ (database migrations)
# - supabase/functions/ (edge functions)
```

### Step 4: Configure Supabase (Optional)

Edit `supabase/config.toml` to customize:

```toml
[project_id]
project_id = "startupai16"

[db]
port = 54322
major_version = 17  # Match your production database version

[api]
port = 54321
enabled = true

[studio]
port = 54323
enabled = true

# Disable analytics if vector container causes issues
[analytics]
enabled = false  # Set to false if vector container fails
```

**Key Configuration Options:**

- **`analytics.enabled = false`** - Disables Logflare/Vector (recommended if Docker socket issues persist)
- **`db.major_version`** - Must match production database version
- **`api.port`** - API gateway port (default: 54321)
- **`studio.port`** - Supabase Studio port (default: 54323)

### Step 5: Start Supabase

```bash
# Start all services
supabase start

# Expected output:
# Started supabase local development setup.
# API URL: http://localhost:54321
# GraphQL URL: http://localhost:54321/graphql/v1
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL: http://localhost:54323
# Inbucket URL: http://localhost:54324
# JWT secret: <secret>
# anon key: <key>
# service_role key: <key>
```

**Troubleshooting Startup:**

1. **If vector container fails:**
   ```bash
   # Option 1: Disable analytics in config.toml
   [analytics]
   enabled = false
   
   # Option 2: Remove problematic container
   docker rm -f supabase_vector_startupai16
   
   # Restart Supabase
   supabase stop
   supabase start
   ```

2. **If Docker socket errors persist:**
   ```bash
   # Check Docker is running
   docker ps
   
   # Check socket permissions
   ls -la ~/.docker/desktop/docker.sock
   
   # Restart Docker Desktop
   systemctl --user restart docker-desktop
   ```

3. **If port conflicts:**
   ```bash
   # Check what's using the ports
   sudo lsof -i :54321
   sudo lsof -i :54322
   sudo lsof -i :54323
   
   # Change ports in config.toml if needed
   ```

### Step 6: Verify Setup

```bash
# Check all containers are running
docker ps

# Check Supabase status
supabase status

# Access Supabase Studio
# Open browser: http://localhost:54323

# Test database connection
psql postgresql://postgres:postgres@localhost:54322/postgres
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Docker Daemon Not Running

**Error:**
```
Cannot connect to the Docker daemon at unix:///home/sk/.docker/desktop/docker.sock
```

**Solution:**
```bash
# Start Docker Desktop
systemctl --user start docker-desktop

# Or restart Docker Desktop
systemctl --user restart docker-desktop

# Verify
docker ps
```

### Issue 2: Vector Container Unhealthy

**Error:**
```
supabase_vector_startupai16 container is not ready: unhealthy
Connection refused (os error 111)
```

**Solution:**

**Option A: Disable Analytics (Recommended for Development)**
```toml
# In supabase/config.toml
[analytics]
enabled = false
```

**Option B: Fix Docker Socket Access**
```bash
# Ensure Docker socket is accessible
export DOCKER_HOST=unix://$HOME/.docker/desktop/docker.sock

# Remove problematic container
docker rm -f supabase_vector_startupai16

# Restart Supabase
supabase stop
supabase start
```

**Option C: Use Docker Engine Instead**
```bash
# Switch to Docker Engine (not Desktop)
# Remove Docker Desktop socket references
unset DOCKER_HOST

# Use standard Docker socket
sudo usermod -aG docker $USER
# Log out and back in
```

### Issue 3: Permission Denied on Docker Socket

**Error:**
```
permission denied while trying to connect to the Docker daemon socket
```

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in (or use newgrp)
newgrp docker

# Verify
docker ps
```

### Issue 4: Port Already in Use

**Error:**
```
Error: port 54321 is already in use
```

**Solution:**
```bash
# Find process using port
sudo lsof -i :54321

# Kill process or change port in config.toml
[api]
port = 54325  # Use different port
```

### Issue 5: Migration Errors

**Error:**
```
ERROR: relation "public.table_name" does not exist
```

**Solution:**
- All migrations have been fixed with conditional `DO $$` blocks
- Ensure migrations are idempotent (can run multiple times)
- Check migration order in `supabase/migrations/`

---

## 📋 Daily Workflow

### Starting Development

```bash
# 1. Ensure Docker is running
docker ps

# 2. Start Supabase
cd /home/sk/startupai16
supabase start

# 3. Verify services
supabase status

# 4. Access Studio
# Open: http://localhost:54323
```

### Stopping Development

```bash
# Stop all services (keeps data)
supabase stop

# Stop and remove all data
supabase stop --no-backup
```

### Database Operations

```bash
# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db reset  # Resets database and applies all migrations

# Push migrations to remote
supabase db push --db-url "postgresql://user:pass@host:5432/dbname"

# Generate TypeScript types
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Edge Functions

```bash
# Deploy function
supabase functions deploy function-name

# Serve functions locally
supabase functions serve function-name

# Test function locally
curl -X POST http://localhost:54321/functions/v1/function-name \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

---

## 🔐 Security Best Practices

### 1. Never Commit Secrets

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo "supabase/.env" >> .gitignore
```

### 2. Use Environment Variables

```bash
# Store secrets in .env file (not committed)
# Reference in config.toml using env() function
[studio]
openai_api_key = "env(OPENAI_API_KEY)"
```

### 3. Restrict Docker Socket Access

```bash
# Only add trusted users to docker group
sudo usermod -aG docker $USER

# Use Docker Desktop user isolation when possible
```

### 4. Firewall Configuration

```bash
# If exposing Supabase publicly, restrict ports
sudo ufw allow 54321/tcp  # API
sudo ufw allow 54323/tcp  # Studio (if needed)
sudo ufw deny 54322/tcp   # Database (never expose publicly)
```

---

## 📚 Additional Resources

### Official Documentation

- **Local Development:** https://supabase.com/docs/guides/local-development
- **CLI Reference:** https://supabase.com/docs/reference/cli
- **Config Reference:** https://supabase.com/docs/guides/local-development/cli/config
- **Self-Hosting:** https://supabase.com/docs/guides/self-hosting/docker

### Community Resources

- **GitHub Discussions:** https://github.com/orgs/supabase/discussions
- **Docker Hub:** https://hub.docker.com/u/supabase
- **Supabase CLI GitHub:** https://github.com/supabase/cli

### Troubleshooting

- **Check Supabase logs:**
  ```bash
  supabase logs
  ```

- **Check Docker logs:**
  ```bash
  docker compose logs [service-name]
  ```

- **Reset everything:**
  ```bash
  supabase stop
  docker compose down -v  # Remove volumes
  supabase start
  ```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Docker daemon is running (`docker ps` works)
- [ ] Supabase CLI is installed (`supabase --version`)
- [ ] `supabase start` completes without errors
- [ ] All containers show "healthy" status (`docker ps`)
- [ ] Supabase Studio accessible at http://localhost:54323
- [ ] Database accessible at `postgresql://postgres:postgres@localhost:54322/postgres`
- [ ] API accessible at http://localhost:54321
- [ ] Migrations apply successfully (`supabase db reset`)
- [ ] Edge functions can be deployed (`supabase functions deploy`)

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Start Supabase
supabase start

# Stop Supabase
supabase stop

# Check status
supabase status

# View logs
supabase logs

# Reset database
supabase db reset

# Create migration
supabase migration new name

# Deploy function
supabase functions deploy function-name

# Generate types
supabase gen types typescript --local
```

### Connection Strings

```bash
# Database (direct)
postgresql://postgres:postgres@localhost:54322/postgres

# API
http://localhost:54321

# Studio
http://localhost:54323

# Edge Functions
http://localhost:54321/functions/v1/function-name
```

### Environment Variables

```bash
# Set in .env or export
export SUPABASE_URL=http://localhost:54321
export SUPABASE_ANON_KEY=<anon-key-from-supabase-status>
export SUPABASE_SERVICE_ROLE_KEY=<service-role-key-from-supabase-status>
```

---

**Last Updated:** 2025-01-23  
**Maintained By:** Development Team  
**Status:** ✅ Production Ready
