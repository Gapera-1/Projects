# PowerShell script to start both frontend and backend servers
# Run this from the capstone_project directory

Write-Host "=== Starting Medicine Reminder Application ===" -ForegroundColor Cyan
Write-Host ""

# Start Frontend in a new window
Write-Host "Starting Frontend (React/Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\medicine-reminder'; Write-Host 'Frontend Server - http://localhost:5173' -ForegroundColor Green; npm run dev"

# Wait a moment for frontend to start
Start-Sleep -Seconds 2

# Start Backend in a new window
Write-Host "Starting Backend (Django)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\medicine_api\start_backend.ps1"

Write-Host ""
Write-Host "✓ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Close the server windows to stop the servers." -ForegroundColor Yellow

