import sys
from cx_Freeze import setup, Executable

# Dependencies are automatically detected, but it might need
# fine tuning.
build_options = {'packages': [
    'jinja2', 'srsly', 'msgpack', 'cymem', 'blis', 'spacy', 'spacy_legacy', 'huspacy', 'hu_core_news_lg', 'flask', 'flask_cors', 'psycopg2', ], 'excludes': []}

base = 'Console'

executables = [
    Executable('app.py', base=base)
]

setup(name='Parsec_backend',
      version='1.0',
      description='Backend for parsec',
      options={'build_exe': build_options},
      executables=executables)
