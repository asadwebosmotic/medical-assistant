from fastapi import FastAPI, Form, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from llm.llm_config import chat_chain, memory  # ✅ Import memory from llm_config.py
from data_processing.parsing import extract
import logging
import shutil
import tempfile
import os

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

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
        response = chat_chain.invoke({"input": final_input})

        return JSONResponse({
            "status": "success",
            "response": response.get("text", str(response))
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
            "You have already reviewed the patient's medical report and provided an interpretation. "
            "Now the patient is asking a follow-up question based on those findings. "
            "Be specific, refer to previously mentioned values like HbA1c or cholesterol, and personalize the answer if patient name is known.\n\n"
            f"Follow-up question: {user_input}"
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
