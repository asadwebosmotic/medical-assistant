from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import JSONResponse
from llm.llm_config import chat_chain
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.post("/chat/")
async def chat_with_report(
    report_text: str = Form(""),
    user_input: str = Form(...),
    medical_history: str = Form(None)
):
    try:
        # Validate inputs
        if not user_input.strip():
            logger.error("User input is empty")
            raise HTTPException(status_code=400, detail="User input cannot be empty")
        if not report_text.strip():
            logger.warning("No report text provided")
            # Allow empty report_text for follow-up questions if context exists

        # Create input for LLM
        final_input = f"Here is a patient's medical report:\n\n{report_text}\n\nPatient's medical history: {medical_history or 'Not provided'}\n\nPatient's query: {user_input}"

        # Run LLM chain
        response = chat_chain.invoke({"input": final_input})
        if isinstance(response, dict):
            response = response.get("text", str(response))
        logger.info("Successfully generated response from LLM")

        return JSONResponse({
            "status": "success",
            "response": response
        })

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return JSONResponse({
            "status": "error",
            "error": str(e)
        }, status_code=500)