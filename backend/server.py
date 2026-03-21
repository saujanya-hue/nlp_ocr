from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import easyocr
import cohere
from gtts import gTTS
import io
import os

app = Flask(__name__)
CORS(app)

# Initialize OCR reader
reader = easyocr.Reader(['en'])
# Initialize Cohere client
cohere_api_key = os.getenv("COHERE_API_KEY")
cohere_client = cohere.Client(cohere_api_key)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        image = request.files['image']
        image_path = "temp_image.jpg"
        image.save(image_path)

        result = reader.readtext(image_path, detail=0)
        extracted_text = "\n".join(result)

        return jsonify({"text": extracted_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/speak', methods=['POST'])
def speak():
    try:
        data = request.get_json()
        text = data.get("text", "")
        if not text:
            return jsonify({"error": "No text provided"}), 400

        tts = gTTS(text=text, lang="en")
        audio_io = io.BytesIO()
        tts.write_to_fp(audio_io)
        audio_io.seek(0)

        return send_file(audio_io, mimetype='audio/mpeg')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        context = data.get("text", "")
        question = data.get("question", "")

        if not context or not question:
            return jsonify({"error": "Missing context or question"}), 400

        try:
            response = cohere_client.chat(
                message=question,
                documents=[{"title": "Extracted Document", "snippet": context}],
                model="command-r-08-2024"
            )
            answer = response.text
            return jsonify({"answer": answer})
        except cohere.errors.UnauthorizedError:
            return jsonify({"error": "Invalid Cohere API key. Please check your configuration."}), 401
        except Exception as e:
            print(f"Cohere error: {e}")
            return jsonify({"error": f"AI Service Error: {str(e)}"}), 502

    except Exception as e:
        print(f"Error in /ask: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
