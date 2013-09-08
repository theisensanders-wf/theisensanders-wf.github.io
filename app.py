import os
from flask import Flask, render_template, request, redirect

import settings

app = Flask(__name__)

app.config.from_object(settings)


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/contact', methods=['POST'])
def contact():
    print request.json
    return redirect('/thankyou')

@app.route('/thankyou')
def thankyou():
    test = request
    print request.data
    return render_template('thankyou.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
