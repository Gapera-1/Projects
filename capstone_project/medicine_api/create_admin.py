"""
Admin Registration Instructions:

To create an admin account, send a POST request to:
  http://127.0.0.1:8000/api/auth/admin-signup/

With this JSON body:
{
  "email": "admin@example.com",
  "password": "123456",
  "admin_key": "admin123"
}

The admin_key is a secret code that must match the one in views.py (AdminSignupView).
Default admin_key: "admin123"

IMPORTANT: Change the admin_key in production!

After creating the admin account:
1. Go to: http://127.0.0.1:8000/admin/
2. Login with email and password
3. You can manage medicines and users
"""

print(__doc__)
