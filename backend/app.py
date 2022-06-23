import json
from flask import Flask
from flask_cors import CORS
import hu_core_news_lg
import psycopg2
from psycopg2.extras import RealDictCursor


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def get_db_connecton():
    conn = psycopg2.connect(
        host="localhost",
        database="parsec_db",
        user='postgres',
        password='Foxtastic')
    return conn


nlp = hu_core_news_lg.load()


@app.route("/stopword")
def index():
    conn = get_db_connecton()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql_get_all_stop_words = 'SELECT * FROM stop_words'
    cur.execute(sql_get_all_stop_words)
    result = cur.fetchall()
    cur.close()
    conn.close()
    return json.dumps(result, ensure_ascii=False).encode('UTF-8')
