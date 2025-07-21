# from config import settings
# import pdfplumber
# from utils.utils import PdfExtractor
# import concurrent.futures
# from mistralai import Mistral
# from mistralai.extra import response_format_from_pydantic_model
# from utils.utils import Image, PdfExtractionResult, PageText
# import logging

# logger = logging.getLogger(__name__)

# def extract(filename: str) -> PdfExtractionResult:
#     client = Mistral(api_key=settings.Mistral_OCR_API_KEY)
#     base64_file = PdfExtractor._encode_file(filename)

#     with open(filename, "rb") as f:
#         with pdfplumber.open(f) as pdf_reader:
#             total_pages = len(pdf_reader.pages)

#     # Process pages in parallel
#     def process_page(page_num):
#         ocr_response = client.ocr.process(
#             model="mistral-ocr-latest",
#             pages=[page_num],
#             document={
#                 "type": "document_url",
#                 "document_url": f"data:application/pdf;base64,{base64_file}"
#             },
#             bbox_annotation_format=response_format_from_pydantic_model(Image),
#             include_image_base64=False
#         )

#         if not ocr_response or not ocr_response.pages:
#             logger.error(f"No data returned for page {page_num+1}")
#             return PageText(page_number=page_num+1, text="Error: Unable to process page", filename=filename or "unknown")
        
#         page_text = ocr_response.pages[0].markdown + "\n\n" + "\n\n".join(
#             [f"Annotation for {image_data.id} : {image_data.image_annotation}" 
#              for image_data in ocr_response.pages[0].images]
#         )

#         logger.info(f"Page {page_num+1} parsed successfully")
        
#         return PageText(
#             page_number=page_num+1,
#             text=page_text,
#             filename=filename or "unknown"
#         )

#     # Using ThreadPoolExecutor for I/O-bound tasks
#     with concurrent.futures.ThreadPoolExecutor() as executor:
#         pages = list(executor.map(process_page, range(total_pages)))

#     return PdfExtractionResult(pages=pages)

# import os
# import pdfplumber
# import pytesseract
# from PIL import Image
# from pdf2image import convert_from_path
# from utils.utils import PdfExtractionResult, PageText
# import logging

# logger = logging.getLogger(__name__)

# def extract(filename: str) -> PdfExtractionResult:
#     if os.path.splitext(filename)[1].lower() != ".pdf":
#         raise ValueError("Unsupported file type")

#     pages_data = []

#     with pdfplumber.open(filename) as pdf:
#         logger.info(f"Total pages in PDF: {len(pdf.pages)}")

#         for i, page in enumerate(pdf.pages):
#             page_num = i + 1
#             text = ""

#             # Step 1: Try direct text extraction
#             try:
#                 text = page.extract_text(layout=True)
#                 if text and len(text.strip()) >= 50:
#                     logger.info(f"✅ Parsed text from page {page_num} using pdfplumber.")
#                 else:
#                     raise ValueError("Text too short or missing")
#             except Exception as e:
#                 logger.warning(f"⚠️ pdfplumber extract_text failed for page {page_num}: {e}")
#                 text = ""

#             # Step 2: Try OCR using page.to_image()
#             if not text:
#                 try:
#                     logger.info(f"🔁 Attempting OCR with pdfplumber.to_image on page {page_num}...")
#                     image = page.to_image(resolution=300).original
#                     text = pytesseract.image_to_string(image, config='--oem 3 --psm 6')
#                     if text and len(text.strip()) >= 50:
#                         logger.info(f"✅ OCR succeeded for page {page_num} with pdfplumber.to_image.")
#                     else:
#                         raise ValueError("OCR result too short")
#                 except Exception as e:
#                     logger.warning(f"⚠️ OCR via pdfplumber.to_image failed for page {page_num}: {e}")
#                     text = ""

#             # Step 3: Final fallback — pdf2image + OCR
#             if not text:
#                 try:
#                     logger.info(f"🧯 Final fallback: trying pdf2image + pytesseract on page {page_num}...")
#                     fallback_images = convert_from_path(filename, dpi=300, first_page=page_num, last_page=page_num)
#                     if fallback_images:
#                         text = pytesseract.image_to_string(fallback_images[0], config='--oem 3 --psm 6')
#                         logger.info(f"✅ OCR succeeded using pdf2image for page {page_num}.")
#                 except Exception as e:
#                     logger.error(f"❌ pdf2image fallback failed on page {page_num}: {e}")
#                     text = ""

#             # Extract tables (only from pdfplumber)
#             table_text = ""
#             try:
#                 tables = page.extract_tables() or []
#                 for table in tables:
#                     table_text += "\n\nTable:\n" + "\n".join(
#                         " | ".join(str(cell) if cell is not None else "" for cell in row)
#                         for row in table
#                     )
#             except Exception as e:
#                 logger.warning(f"⚠️ Table extraction failed on page {page_num}: {e}")

#             # Clean and combine
#             cleaned_text = "\n".join(line.strip() for line in (text or "").splitlines() if line.strip())
#             full_text = cleaned_text + table_text

#             pages_data.append(PageText(
#                 page_number=page_num,
#                 text=full_text,
#                 filename=os.path.basename(filename),
#                 method="pdfplumber" / "ocr:plumber" / "ocr:pdf2image" 
#             ))

#     return PdfExtractionResult(pages=pages_data)

#Llamaparser
from llama_parse import LlamaParse
from utils.utils import PageText, PdfExtractionResult
import os
from config import settings

LLAMAPARSE_API_KEY = settings.LLAMAPARSE_API_KEY

def extract(filename: str) -> PdfExtractionResult:
    parser = LlamaParse(api_key=LLAMAPARSE_API_KEY)

    # Parse the document (sync version — waits for processing)
    job = parser.parse(filename)  # or "markdown", or "json"
    documents = job.get_text_documents()

    pages = []
    for i, doc in enumerate(documents):
        pages.append(PageText(
            page_number=i + 1,
            text=doc.text,
            filename=os.path.basename(filename)
        ))

    return PdfExtractionResult(pages=pages)