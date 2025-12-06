from flask import Flask, send_file

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)