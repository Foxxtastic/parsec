from datetime import date
import json
from flask import Flask, request
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

from hu_nlp import find_keywords, get_most_common_words, get_sentences


app = Flask(__name__)
cors = CORS(app, origins="*")
app.config['CORS_HEADERS'] = 'Access-Control-Allow-Origin'

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)


def get_db_connecton():
    conn = psycopg2.connect(
        host="ec2-54-228-32-29.eu-west-1.compute.amazonaws.com",
        database="d301mscimutnih",
        user='rqsjevywrneioy',
        password='a19b0df78c8ebbba808e4ed4e29ba347ac86b6044ff9e8f36edb858ea6b8d5dd',
        port=5432)
    return conn


@app.route("/")
def home():
    return("This is the backend of parsec!")


@app.route("/document", methods=['GET', 'POST', 'DELETE'])
def document():
    conn = get_db_connecton()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    if request.method == 'GET':
        sql_get_all_documents = "SELECT id, file_name, uploaded FROM documents"
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
def get_document_content(id):
    conn = get_db_connecton()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT id, file_name, file, uploaded FROM documents WHERE id = %s", (
        id,))
    sql_result = cur.fetchall()
    cur.close()
    conn.close()
    text_from_file = str(sql_result[0]['file'], 'UTF-8')
    sentences = get_sentences(text_from_file)
    result = {'file_name': sql_result[0]['file_name'], 'sentences': sentences}
    return json.dumps(result, ensure_ascii=False, default=str).encode('UTF-8')


@app.route("/find_keywords", methods=['POST'])
def find_keywords_in_sents():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        text = request.json
        conn = get_db_connecton()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        sql_get_all_key_words = 'SELECT * FROM key_words'
        cur.execute(sql_get_all_key_words)
        sql_result = cur.fetchall()
        cur.close()
        conn.close()
        keywords = []
        for k in sql_result:
            keywords.append(k['key_word'])
        founded_keywords = find_keywords(text, keywords)
        most_common_words = get_most_common_words(text)
        result = {'keywords': founded_keywords,
                  'common_words': most_common_words}
        return json.dumps(result, ensure_ascii=False).encode('UTF-8')

    else:
        return 'Content-Type not supported!'


@app.route("/keyword", methods=['GET', 'POST', 'PUT', 'DELETE'])
def keyword():
    conn = get_db_connecton()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    if request.method == 'GET':
        sql_get_all_key_words = 'SELECT * FROM key_words'
        cur.execute(sql_get_all_key_words)
        result = cur.fetchall()
        cur.close()
        conn.close()
        return json.dumps(result, ensure_ascii=False).encode('UTF-8')

    if request.method == 'POST':
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            cur.execute(
                'INSERT INTO key_words (key_word) VALUES (%s)', (request_json,))
            conn.commit()
            cur.close()
            conn.close()
            return json.dumps("keyword inserted", ensure_ascii=False).encode('UTF-8')

        else:
            return 'Content-Type not supported!'

    if request.method == 'DELETE':
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            cur.execute(
                'DELETE FROM key_words WHERE id = %s', (request_json,))
            conn.commit()
            cur.close()
            conn.close()
            return json.dumps("keyword deleted", ensure_ascii=False).encode('UTF-8')

        else:
            return 'Content-Type not supported!'

    if request.method == 'PUT':
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            request_json = request.json
            cur.execute(
                'UPDATE key_words SET key_word = %s WHERE id = %s', (request_json['data'], request_json['id'],))
            conn.commit()
            cur.close()
            conn.close()
            return json.dumps("keyword changed", ensure_ascii=False).encode('UTF-8')

        else:
            return 'Content-Type not supported!'


@app.route("/stopword", methods=['GET', 'POST', 'PUT', 'DELETE'])
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
