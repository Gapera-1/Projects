#!/usr/bin/env python
"""Script to create the medicine_db database if it doesn't exist."""
import pymysql
import sys

try:
    # Connect to MySQL server (without specifying database)
    connection = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='oliga123',
        port=3306
    )
    
    with connection.cursor() as cursor:
        # Create database if it doesn't exist
        cursor.execute("CREATE DATABASE IF NOT EXISTS medicine_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print("[OK] Database 'medicine_db' created successfully (or already exists)")
        
        # Verify it was created
        cursor.execute("SHOW DATABASES LIKE 'medicine_db'")
        result = cursor.fetchone()
        if result:
            print(f"[OK] Verified: Database '{result[0]}' exists")
        else:
            print("[ERROR] Database was not created")
            sys.exit(1)
    
    connection.close()
    print("[OK] Database setup complete!")
    
except pymysql.Error as e:
    print(f"[ERROR] MySQL Error: {e}")
    print("\nPlease check:")
    print("1. MySQL service is running")
    print("2. MySQL root password is correct: oliga123")
    print("3. MySQL is installed and accessible")
    sys.exit(1)
except Exception as e:
    print(f"[ERROR] Error: {e}")
    sys.exit(1)

