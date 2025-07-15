import streamlit as st
import requests
import os
import shutil
import tempfile
from langchain.memory import ConversationBufferMemory
from data_processing.parsing import extract
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Config
st.set_page_config(page_title="🩺 Medical Reports Explainer", page_icon="🧬", layout="wide")

# Sidebar
with st.sidebar:
    st.title("About")
    st.markdown("""
        This AI-powered report summarizer helps explain what’s going on inside your body based on your uploaded reports.
        
        **Note:** This tool is for informational purposes only and does not replace professional medical advice.
        """)
    st.markdown("---")
    st.markdown("""
        ## How to use
        1. Upload the PDF containing pathology reports.
        2. Ask the assistant to explain the reports.
        3. Add relevant medical history (optional).
        4. Click "Analyze Report."
        5. Review the results and ask follow-up questions.
        """)
    st.warning("""
        **Medical Disclaimer:** 
        This application provides general information and is not a substitute for professional medical advice. 
        Always consult with a healthcare provider for medical concerns.
        """)

# Header
st.markdown("""
<style>
    .report-style {
        background-color: #f9f9f9;
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid #ddd;
        font-family: 'Segoe UI', sans-serif;
        white-space: pre-wrap;
        color: #1f2937;
    }
    .stButton>button {
        background-color: #2563eb;
        color: white;
        font-weight: 600;
        padding: 0.6em 1.2em;
        border-radius: 6px;
        border: none;
        transition: all 0.2s ease-in-out;
    }
    .stButton>button:hover {
        background-color: #1d4ed8;
        transform: scale(1.02);
    }
</style>
""", unsafe_allow_html=True)

st.title("🧬 AI-Powered Medical Report Summarizer 🩺")
st.markdown("Upload your medical report and get a friendly, accurate explanation you can actually understand.")

# Initialize session state
if "chat_memory" not in st.session_state:
    st.session_state.chat_memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
if "report_text" not in st.session_state:
    st.session_state.report_text = None
if "uploaded_file_name" not in st.session_state:
    st.session_state.uploaded_file_name = None
if "medical_history" not in st.session_state:
    st.session_state.medical_history = ""

# File uploader and inputs
uploaded_file = st.file_uploader("📄 Upload your medical report (PDF only):", type=["pdf"], accept_multiple_files=False)
user_input = st.text_input("💬 Ask something about your report:", value="Explain this report.")
st.session_state.medical_history = st.text_area("🩺 Provide your medical history (optional):", placeholder="E.g., I have diabetes and high blood pressure.")

# Process uploaded file
if uploaded_file:
    try:
        st.session_state.uploaded_file_name = uploaded_file.name
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(uploaded_file, tmp)
            tmp_path = tmp.name
        try:
            parsed_result = extract(tmp_path)
            st.session_state.report_text = "\n\n".join([page.text for page in parsed_result.pages])
            logger.info("📄 OCR'd Report Text:\n", st.session_state.report_text)
            logger.info(f"Successfully parsed file: {uploaded_file.name}")
        finally:
            try:
                os.remove(tmp_path)
                logger.info(f"Successfully deleted temporary file: {tmp_path}")
            except Exception as e:
                logger.warning(f"Failed to delete temporary file {tmp_path}: {str(e)}")
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        st.error(f"❌ Error processing file: {str(e)}")

# API call function
def chat_with_api(report_text, user_input, medical_history):
    try:
        api_url = "http://127.0.0.1:8000/chat/"
        data = {
            "report_text": report_text or "",
            "user_input": user_input,
            "medical_history": medical_history or "Not provided"
        }
        response = requests.post(api_url, data=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"API call failed with HTTP error: {str(e)}")
        return {"status": "error", "error": f"Server error: {str(e)}"}
    except requests.exceptions.RequestException as e:
        logger.error(f"API call failed with network error: {str(e)}")
        return {"status": "error", "error": f"Network error: Please try again later"}
    except Exception as e:
        logger.error(f"API call failed: {str(e)}")
        return {"status": "error", "error": f"Unexpected error: {str(e)}"}

# Analyze report
if st.button("🔍 Analyze Report"):
    if not st.session_state.report_text:
        st.warning("Please upload a PDF medical report first.")
    elif not user_input.strip():
        st.warning("Please enter a query for the report.")
    else:
        with st.spinner("Processing..."):
            logger.info(f"Processing query: {user_input}")
            final_input = f"Here is a patient's medical report:\n\n{st.session_state.report_text}\n\nPatient's medical history: {st.session_state.medical_history or 'Not provided'}\n\nPatient's query: {user_input}"
            result = chat_with_api(st.session_state.report_text, final_input, st.session_state.medical_history)
            if result.get("status") == "success":
                st.markdown("---")
                st.subheader("📋 AI Interpretation")
                st.markdown(f"<div class='report-style'>{result['response']}</div>", unsafe_allow_html=True)
                st.session_state.chat_memory.save_context({"input": user_input}, {"output": result["response"]})
                logger.info("Successfully processed report analysis")
            else:
                st.error(f"❌ Error: {result.get('error', 'Failed to process the report. Please try again or contact support.')}")
                logger.error(f"Failed to process report: {result.get('error')}")

# Follow-up questions
st.subheader("💬 Follow-Up Questions")
follow_up_input = st.text_input("Ask a follow-up question:", key="follow_up")
if st.button("Send Follow-Up"):
    if not st.session_state.report_text:
        st.warning("Please upload a PDF medical report first.")
    elif not follow_up_input.strip():
        st.warning("Please enter a follow-up question.")
    else:
        with st.spinner("Processing..."):
            logger.info(f"Processing follow-up query: {follow_up_input}")
            final_input = f"Here is a patient's medical report:\n\n{st.session_state.report_text}\n\nPatient's medical history: {st.session_state.medical_history or 'Not provided'}\n\nPatient's query: {follow_up_input}"
            result = chat_with_api(st.session_state.report_text, final_input, st.session_state.medical_history)
            if result.get("status") == "success":
                st.markdown(f"<div class='report-style'>{result['response']}</div>", unsafe_allow_html=True)
                st.session_state.chat_memory.save_context({"input": follow_up_input}, {"output": result["response"]})
                logger.info("Successfully processed follow-up question")
            else:
                st.error(f"❌ Error: {result.get('error', 'Failed to process the follow-up question. Please try again or contact support.')}")
                logger.error(f"Failed to process follow-up: {result.get('error')}")