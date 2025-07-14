import streamlit as st
import requests
from PIL import Image

# Config
st.set_page_config(page_title="🩺 Medical Reports Explainer", page_icon="🧬", layout="wide")

# Sidebar
with st.sidebar:
    st.title("About")
    st.markdown("""
        This AI-powered reports summerizer helps explaining what is going inside your biological sel based on your uploaded reports.
        
        **Note:** This tool is for informational purposes only and does not replace professional medical advice.
        """)
    st.markdown("---")
    st.markdown("""
        ## How to use
        1. Upload the pdf concisting pathology reports.
        2. Ask the assistant to explain the reports.
        3. Add relevant medical history.
        4. Click "Analyze Reports.".
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

st.title("🧬 AI-Powered Medical Report Summerizer 🩺")
st.markdown("Upload your medical report and get a friendly, accurate explanation you can actually understand.")


# File uploader and input
uploaded_file = st.file_uploader("📄 Upload your medical report (PDF only):", type=["pdf"])
user_input = st.text_input("💬 Ask something about your report:", value="Explain this report..")

if st.button("🔍 Analyze Report"):
    if uploaded_file is None:
        st.warning("Please upload a PDF medical report first.")
    elif not user_input.strip():
        st.warning("Please enter a query for the report.")
    else:
        with st.spinner("Processing..."):
            try:
                api_url = "http://127.0.0.1:8000/chat/"  # Change if deployed elsewhere
                files = {"file": (uploaded_file.name, uploaded_file, uploaded_file.type)}
                data = {"user_input": user_input}
                response = requests.post(api_url, files=files, data=data)
                result = response.json()

                if response.status_code == 200 and result.get("status") == "success":
                    st.markdown("---")
                    st.subheader("📋 AI Interpretation")
                    st.markdown(f"<div class='report-style'>{result['response']}</div>", unsafe_allow_html=True)
                else:
                    st.error(f"❌ Error: {result.get('error', 'Unknown issue')}")
            except Exception as e:
                st.error(f"🚨 Could not reach the backend: {e}")