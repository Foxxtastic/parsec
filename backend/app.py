import json
from flask import Flask
import hu_core_news_lg
from langcodes import Language
import psycopg2
from stopwords import stop_words

app = Flask(__name__)


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
    cur = conn.cursor()
    cur.execute('SELECT * FROM stop_words')
    result = cur.fetchall()
    cur.close()
    conn.close()
    return json.dumps(result, ensure_ascii=False).encode('UTF-8')
