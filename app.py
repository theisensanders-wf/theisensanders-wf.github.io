import os
from flask import Flask, render_template

import settings

app = Flask(__name__)
app.debug = True

app.config.from_object(settings)

@app.route('/')
def home():
    return render_template('home.html')

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
