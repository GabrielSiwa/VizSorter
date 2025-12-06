from flask import Flask, send_file, request, jsonify
import requests

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/api/sort', methods=['POST'])
def sort_data():
    """Forward request to Java API"""
    try:
        data = request.json
        response = requests.post('http://localhost:8080/api/sort', json=data)
        return response.json()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)