from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__)

JAVA_API_URL = os.getenv('JAVA_API_URL', 'http://api.railway.internal:8080')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/sort', methods=['POST'])
def sort_data():
    """Forward single sort request to Java backend"""
    try:
        data = request.json
        response = requests.post(f'{JAVA_API_URL}/api/sort', json=data, timeout=5)
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Java backend not running: {str(e)}'}), 503

@app.route('/api/compare', methods=['POST'])
def compare_algorithms():
    """Compare multiple sorting algorithms"""
    data = request.json
    try:
        response = requests.post(f'{JAVA_API_URL}/api/compare', json=data)
        return response.json()
    except Exception as e:
        return {'error': str(e)}, 500

@app.route('/api/stress-test', methods=['POST'])
def stress_test():
    """Forward stress test request to Java backend"""
    try:
        data = request.json
        response = requests.post(f'{JAVA_API_URL}/api/stress-test', json=data, timeout=30) # Increased timeout for heavy lifting
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Java backend not running or timed out: {str(e)}'}), 503

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Fetch performance analytics"""
    try:
        response = requests.get(f'{JAVA_API_URL}/api/analytics', timeout=5)
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Java backend not running: {str(e)}'}), 503

if __name__ == '__main__':
    app.run(debug=True, port=5000)