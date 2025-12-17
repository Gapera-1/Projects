# PowerShell script to start the Django backend server
# This script sets up the database environment variables and starts the server

Write-Host "=== Medicine Reminder Backend Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if DB_PASSWORD is already set
if (-not $env:DB_PASSWORD) {
    Write-Host "Database password not set. Please enter your MySQL root password:" -ForegroundColor Yellow
    $securePassword = Read-Host -Prompt "MySQL Password" -AsSecureString
    $env:DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
}

# Set other database variables if not already set
if (-not $env:DB_NAME) { $env:DB_NAME = "medicine_db" }
if (-not $env:DB_USER) { $env:DB_USER = "root" }
if (-not $env:DB_HOST) { $env:DB_HOST = "127.0.0.1" }
if (-not $env:DB_PORT) { $env:DB_PORT = "3306" }

Write-Host "Database Configuration:" -ForegroundColor Green
Write-Host "  DB_NAME: $env:DB_NAME"
Write-Host "  DB_USER: $env:DB_USER"
Write-Host "  DB_HOST: $env:DB_HOST"
Write-Host "  DB_PORT: $env:DB_PORT"
Write-Host "  DB_PASSWORD: [HIDDEN]"
Write-Host ""

# Check database connection
Write-Host "Checking database connection..." -ForegroundColor Yellow
python manage.py check --database default 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database connection successful!" -ForegroundColor Green
} else {
    Write-Host "✗ Database connection failed. Please check:" -ForegroundColor Red
    Write-Host "  1. MySQL server is running" -ForegroundColor Yellow
    Write-Host "  2. Database 'medicine_db' exists (run setup_database.sql)" -ForegroundColor Yellow
    Write-Host "  3. MySQL root password is correct" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to continue anyway or Ctrl+C to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Run migrations
Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Yellow
python manage.py migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Migrations failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Migrations completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Django development server..." -ForegroundColor Cyan
Write-Host "Backend will be available at: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
python manage.py runserver

