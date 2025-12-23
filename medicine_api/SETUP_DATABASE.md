# Database Setup Guide

## Step 1: Create the MySQL Database

You have two options:

### Option A: Using MySQL Command Line

1. Open MySQL command line (or MySQL Workbench)
2. Login with your MySQL root user:
   ```bash
   mysql -u root -p
   ```
3. Enter your MySQL root password when prompted
4. Run the SQL script:
   ```sql
   CREATE DATABASE IF NOT EXISTS medicine_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
5. Verify it was created:
   ```sql
   SHOW DATABASES;
   ```
6. Exit MySQL:
   ```sql
   EXIT;
   ```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Click on "File" → "Open SQL Script"
4. Open `setup_database.sql` from this folder
5. Click the "Execute" button (lightning bolt icon)
6. Verify the database appears in the left sidebar

---

## Step 2: Set Database Password Environment Variable

### Option A: Set in PowerShell (Temporary - for current session only)

**Windows PowerShell:**
```powershell
# Set the environment variable for current session
$env:DB_PASSWORD = "your_mysql_password"

# Optional: Set other database variables
$env:DB_NAME = "medicine_db"
$env:DB_USER = "root"
$env:DB_HOST = "127.0.0.1"
$env:DB_PORT = "3306"

# Verify it's set
echo $env:DB_PASSWORD
```

**Note:** This only lasts for the current PowerShell session. When you close the terminal, you'll need to set it again.

### Option B: Set Permanently in Windows (Recommended)

**Using System Environment Variables (Windows GUI):**
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Click the "Advanced" tab
3. Click "Environment Variables"
4. Under "User variables" (or "System variables"), click "New"
5. Variable name: `DB_PASSWORD`
6. Variable value: Your MySQL root password
7. Click OK on all windows
8. **Important:** Restart your PowerShell/terminal for changes to take effect

**Or using PowerShell (Permanent for User):**
```powershell
# Set permanently for current user
[System.Environment]::SetEnvironmentVariable('DB_PASSWORD', 'your_mysql_password', 'User')

# Restart PowerShell for changes to take effect
```

### Option C: Create a .env file (Alternative - requires python-dotenv)

If you prefer, you can create a `.env` file in the `medicine_api` folder:
```
DB_NAME=medicine_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

But you'll need to install and configure `python-dotenv` package.

---

## Step 3: Verify and Run Migrations

After setting the environment variable, run:

```powershell
cd C:\Users\hp\Projects\capstone_project\medicine_api
python manage.py migrate
```

If everything is configured correctly, you should see:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, reminders, sessions
Running migrations:
  ...
```

---

## Troubleshooting

### If you get "Access denied" error:
- Make sure your MySQL root password is correct
- Check if MySQL service is running: `Get-Service MySQL*` (or check Services in Windows)

### If you get "database doesn't exist" error:
- Make sure you created the database using Step 1
- Verify database name matches: `medicine_db`

### If you can't remember your MySQL root password:
- Reset MySQL root password (varies by MySQL installation)
- Or create a new MySQL user with a known password

