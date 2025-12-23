import pymysql

# 1. Map PyMySQL to behave like the 'mysqlclient' driver
pymysql.install_as_MySQLdb()

# 2. Bypasses the "mysqlclient 2.2.1 or newer is required" error
# This 'fakes' the version number so Django 5.x is satisfied
pymysql.version_info = (2, 2, 1, "final", 0)