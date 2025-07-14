from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from llm.llm_config import chat_chain
from data_processing.parsing import extract
import tempfile
import os
import shutil

app = FastAPI()

@app.post("/chat/")
async def chat_with_report(
    file: UploadFile = File(...),
    user_input: str = Form(...)
):
    try:
        # Save uploaded file to a temp location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        # Parse the PDF using your parsing logic (with OCR fallback)
        parsed_result = extract(tmp_path)

        # Combine extracted page texts
        report_text = "\n\n".join([page.text for page in parsed_result.pages])

        # Create final input for LLM
        final_input = f"Here is a patient's medical report:\n\n{report_text}\n\nPatient's query: {user_input}"

        # Run LLM chain with memory
        response = chat_chain.run(input=final_input)

        return JSONResponse({
            "status": "success",
            "response": response
        })

    except Exception as e:
        return JSONResponse({
            "status": "error",
            "error": str(e)
        }, status_code=500)

    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
