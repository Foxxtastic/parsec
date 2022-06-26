import json
from flask import Flask, request
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


@app.route("/stopword", methods=['GET', 'POST'])
def index():
    conn = get_db_connecton()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    print(request)
    if request.method == 'GET':
        sql_get_all_stop_words = 'SELECT * FROM stop_words'
        cur.execute(sql_get_all_stop_words)
        result = cur.fetchall()
        cur.close()
        conn.close()
        return json.dumps(result, ensure_ascii=False).encode('UTF-8')

    if request.method == 'POST':
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            cur.execute(
                'INSERT INTO stop_words (stop_word) VALUES (%s)', (request_json,))
            conn.commit()
            cur.close()
            conn.close()
            return json.dumps("stopword inserted", ensure_ascii=False).encode('UTF-8')

        else:
            return 'Content-Type not supported!'
