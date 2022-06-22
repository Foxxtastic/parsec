import os
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="flask_db",
    user=os.environ['postgres'],
    password=os.environ['Foxtastic'])
