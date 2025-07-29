from fastapi import FastAPI, Form, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from llm.llm_config import chat_chain, memory  # ✅ Import memory from llm_config.py
from data_processing.parsing import extract
import logging
import shutil
import tempfile
import os, re, json
from fastapi.middleware.cors import CORSMiddleware

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat/")
async def chat_with_report(
    file: UploadFile = File(...),
    user_input: str = Form(default='Please explain this report.'),
    medical_history: str = Form("")
):
    try:
        if not user_input.strip():
            raise HTTPException(status_code=400, detail="User input cannot be empty")

        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        # Extract report text
        parsed_result = extract(tmp_path)
        report_text = "\n\n".join([page.text for page in parsed_result.pages])
        logger.info("Parsed text from uploaded PDF")

        try:
            os.remove(tmp_path)
        except Exception as e:
            logger.warning(f"Failed to delete temp file: {e}")

        # Build LLM input
        final_input = (
            f"Here is a patient's medical report:\n\n{report_text}\n\n"
            f"Patient's medical history: {medical_history or 'Not provided'}\n\n"
            f"Patient's query: {user_input}"
        )

        # LLM call (memory handled inside chat_chain)
        raw_response = chat_chain.invoke({"input": final_input}).get("text", "")

        # 🧹 Strip markdown triple-backticks and parse JSON
        cleaned = re.sub(r"^```json|```$", "", raw_response.strip()).strip()

        try:
            structured = json.loads(cleaned)
        except Exception as e:
            logger.warning(f"Failed to parse LLM output as JSON: {e}")
            structured = {"unstructured": raw_response}

        return JSONResponse({
            "status": "success",
            # "response": raw_response,
            "structured_data": structured
        })

    except Exception as e:
        logger.error(f"Error processing chat: {e}")
        return JSONResponse({
            "status": "error",
            "error": str(e)
        }, status_code=500)

@app.post("/followup/")
async def followup_chat(
    user_input: str = Form(...)
):
    try:
        if not user_input.strip():
            raise HTTPException(status_code=400, detail="Follow-up input cannot be empty")

        # Inject system prompt-style user input
        final_prompt = (
            "You have already analyzed and summarized the patient's medical report earlier. "
            "Now the patient is asking a follow-up question related to that summary.\n\n"

            "First, detect the intent behind the follow-up:\n"
            "- If it's a greeting like 'hello', 'hi', or 'hey': respond briefly and kindly, no summary.\n"
            "- If it's a goodbye like 'bye', 'see you', 'thanks': reply warmly and say you're here if they need anything.\n"
            "- If it's a real question (like about cholesterol or vitamin D): respond specifically based on the earlier medical report summary.\n\n"

            "📌 Important Rules:\n"
            "- DO NOT repeat the full medical summary again.\n"
            "- Keep your answers short, clear, and human. No essays.\n"
            "- Use simple, everyday language — imagine you're explaining it to someone who isn't from a medical background.\n"
            "- Refer to exact values if needed (e.g., 'your LDL was 119 mg/dL').\n"
            "- Be warm, friendly, and professional.\n"
            "- Personalize the answer if the patient's name is known.\n\n"

            f"Follow-up question from the patient: {user_input}"
        )

        response = chat_chain.invoke({"input": final_prompt})

        return JSONResponse({
            "status": "success",
            "response": response.get("text", str(response))
        })

    except Exception as e:
        logger.error(f"Error in follow-up: {e}")
        return JSONResponse({
            "status": "error",
            "error": str(e)
        }, status_code=500)
