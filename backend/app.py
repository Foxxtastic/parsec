from datetime import date
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


@app.route("/document", methods=['GET', 'POST', 'DELETE'])
def document():
    conn = get_db_connecton()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    if request.method == 'GET':
        sql_get_all_documents = "SELECT id, file_name, ENCODE(file, 'base64'), uploaded FROM documents"
        cur.execute(sql_get_all_documents)
        result = cur.fetchall()
        cur.close()
        conn.close()
        return json.dumps(result, ensure_ascii=False, default=str).encode('UTF-8')

    if request.method == 'POST':
        file = request.files['file']
        file_name = file.filename
        file_bytes = file.read()
        now = date.today()
        cur.execute(
            'INSERT INTO documents (file_name, file, uploaded) VALUES (%s, %s, %s)', (file_name, psycopg2.Binary(file_bytes), now))
        conn.commit()
        cur.close()
        conn.close()
        return json.dumps("doument uploaded", ensure_ascii=False).encode('UTF-8')

    if request.method == 'DELETE':
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            file = request.json
            cur.execute(
                'DELETE FROM documents WHERE id = %s', (file,))
            conn.commit()
            cur.close()
            conn.close()
            return json.dumps("document deleted", ensure_ascii=False).encode('UTF-8')

        else:
            return 'Content-Type not supported!'


@app.route("/document/<id>", methods=['GET'])
def get_document(id):
    conn = get_db_connecton()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT id, file_name, ENCODE(file, 'base64'), uploaded FROM documents WHERE id = %s", (
        id,))
    result = cur.fetchall()
    cur.close()
    conn.close()
    return json.dumps(result, ensure_ascii=False, default=str).encode('UTF-8')


@ app.route("/stopword", methods=['GET', 'POST', 'PUT', 'DELETE'])
def stopword():
    conn = get_db_connecton()
    cur = conn.cursor(cursor_factory=RealDictCursor)
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

    if request.method == 'DELETE':
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            cur.execute(
                'DELETE FROM stop_words WHERE id = %s', (request_json,))
            conn.commit()
            cur.close()
            conn.close()
            return json.dumps("stopword deleted", ensure_ascii=False).encode('UTF-8')

        else:
            return 'Content-Type not supported!'

    if request.method == 'PUT':
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            cur.execute(
                'UPDATE stop_words SET stop_word = %s WHERE id = %s', (request_json['data'], request_json['id'],))
            conn.commit()
            cur.close()
            conn.close()
            return json.dumps("stopword changed", ensure_ascii=False).encode('UTF-8')

        else:
            return 'Content-Type not supported!'
