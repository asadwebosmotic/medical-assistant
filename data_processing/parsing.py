from config import settings
import pdfplumber
from utils.utils import PdfExtractor
import concurrent.futures
from mistralai import Mistral
from mistralai.extra import response_format_from_pydantic_model
from utils.utils import Image, PdfExtractionResult, PageText
import logging

logger = logging.getLogger(__name__)

def extract(filename: str) -> PdfExtractionResult:
    client = Mistral(api_key=settings.Mistral_OCR_API_KEY)
    base64_file = PdfExtractor._encode_file(filename)

    with open(filename, "rb") as f:
        with pdfplumber.open(f) as pdf_reader:
            total_pages = len(pdf_reader.pages)

    # Process pages in parallel
    def process_page(page_num):
        ocr_response = client.ocr.process(
            model="mistral-ocr-latest",
            pages=[page_num],
            document={
                "type": "document_url",
                "document_url": f"data:application/pdf;base64,{base64_file}"
            },
            bbox_annotation_format=response_format_from_pydantic_model(Image),
            include_image_base64=False
        )

        if not ocr_response or not ocr_response.pages:
            logger.error(f"No data returned for page {page_num+1}")
            return PageText(page_number=page_num+1, text="Error: Unable to process page", filename=filename or "unknown")
        
        page_text = ocr_response.pages[0].markdown + "\n\n" + "\n\n".join(
            [f"Annotation for {image_data.id} : {image_data.image_annotation}" 
             for image_data in ocr_response.pages[0].images]
        )

        logger.info(f"Page {page_num+1} parsed successfully")
        
        return PageText(
            page_number=page_num+1,
            text=page_text,
            filename=filename or "unknown"
        )

    # Using ThreadPoolExecutor for I/O-bound tasks
    with concurrent.futures.ThreadPoolExecutor() as executor:
        pages = list(executor.map(process_page, range(total_pages)))

    return PdfExtractionResult(pages=pages)
