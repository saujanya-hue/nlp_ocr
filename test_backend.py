import requests
import json

url = "http://127.0.0.1:5000/ask"
payload = {
    "text": "The quick brown fox jumps over the lazy dog.",
    "question": "What does the fox jump over?"
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
