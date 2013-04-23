import os
from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy

import settings

app = Flask(__name__)
app.debug = True

app.config.from_object(settings)
db = SQLAlchemy(app)

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/admin')
def admin():
    return render_template('admin/base.html')

@app.route('/login')
def admin():
    return render_template('admin/login.html')

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
