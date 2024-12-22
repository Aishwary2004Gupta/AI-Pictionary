from flask import Flask, request, jsonify
from flask_cors import CORS 

from dotenv import load_dotenv
from openai import OpenAI

import os
import re

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/submit-drawing": {"origins": "*"}}, methods=["POST", "OPTIONS"])


api_key = os.getenv("OPENAI_API_KEY") # ADD Your OpenAI API key inside the quotes

client = OpenAI(
    api_key=api_key,
)

@app.route('/submit-drawing', methods=['POST', 'OPTIONS'])
def submit_drawing():
    if request.method == 'OPTIONS':
        return jsonify({"message": "CORS preflight request successful"}), 200

    data = request.json
    image_data = data.get('image')

    if not image_data:
        return jsonify({"error": "No image data provided"}), 400

    img_data_match = re.match(r'data:(image/.*?);base64,(.*)', image_data)
    
    if not img_data_match:
        return jsonify({"error": "Invalid image data format"}), 400

    img_type, img_b64_str = img_data_match.groups()

    # Define the prompt to process the image
    prompt = "Analyze this image and guess what it is in a single word."

    try:
        response = client.chat.completions.create(
            model="gpt-4o-2024-08-06", # gpt-4o, gpt-4o-mini
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:{img_type};base64,{img_b64_str}"},
                        },
                    ],
                }
            ],
        )

        guess = response.choices[0].message.content

        # Return the response as JSON
        return jsonify({"guess": guess})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)