from fastapi import FastAPI, File, UploadFile, Form, HTTPException
import * as faceapi from 'face-api.js'
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import time
import json
import logging
import tempfile
import os
import traceback

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is not set in the environment variables.")
genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000","http://localhost:3001","http://localhost:3002","http://localhost:3003","http://127.0.0.1:3001","http://127.0.0.1:3002","http://127.0.0.1:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro-exp-0827",
    generation_config=generation_config,
)

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


@app.post("/process_video/")
async def process_video(
        video_file: UploadFile = File(...),
        prompt: str = Form(
            "Analyze the video and provide a JSON report with workout exercises minimum 5 (name of exercise, sets, reps), facial emotions minimum 10 (emotion, timestamp), voice emotions minimum 8 (emotion, timestamp), and nutrition plan (meal, time, food)")
):
    temp_video_path = None
    try:
        logging.info(f"Received video file: {video_file.filename}")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
            content = await video_file.read()
            temp_video.write(content)
            temp_video_path = temp_video.name

        logging.info(f"Temporary video file created: {temp_video_path}")

        genai_video_file = genai.upload_file(temp_video_path)

        logging.info(f"Completed upload to Google AI: {genai_video_file.uri}")

        timeout = 600
        start_time = time.time()
        while genai_video_file.state.name == "PROCESSING" and (time.time() - start_time) < timeout:
            logging.info(f"Processing... Time elapsed: {time.time() - start_time:.2f}s")
            time.sleep(10)
            genai_video_file = genai.get_file(genai_video_file.name)

        if genai_video_file.state.name == "FAILED":
            raise ValueError(f"Video processing failed: {genai_video_file.state.name}")
        elif genai_video_file.state.name == "PROCESSING":
            raise TimeoutError("Video processing timed out")

        logging.info("Making LLM inference request...")
        response = model.generate_content([prompt, genai_video_file],
                                          request_options={"timeout": 600})

        logging.info("LLM response received. Parsing JSON...")
        data = json.loads(response.text)
        logging.info(f"Parsed JSON data: {json.dumps(data, indent=2)}")

        os.unlink(temp_video_path)
        logging.info(f"Temporary video file deleted: {temp_video_path}")

        return JSONResponse(content=data)

    except Exception as e:
        logging.error(f"Error occurred: {str(e)}")
        logging.error(traceback.format_exc())

        if temp_video_path and os.path.exists(temp_video_path):
            os.unlink(temp_video_path)
            logging.info(f"Temporary video file deleted due to error: {temp_video_path}")

        raise HTTPException(status_code=500, detail=str(e))
