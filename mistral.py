# parsing by mistral

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



# utils.py:
from pydantic import BaseModel
import base64
from pydantic import Field
from typing import ClassVar
from tempfile import NamedTemporaryFile

class PageText(BaseModel):
    page_number: int
    text: str
    filename: str

class PdfExtractionResult(BaseModel):
    pages: list[PageText]

class PdfExtractor:
    @staticmethod
    def _save_temp_file(content: bytes, suffix: str = ".pdf") -> str:
        """Save content to temporary file and return path"""
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(content)
            return tmp.name

    @staticmethod
    def _encode_file(file_location: str) -> str:
        """Encode the file to base64."""
        try:
            with open(file_location, "rb") as file:
                return base64.b64encode(file.read()).decode("utf-8")
        except FileNotFoundError:
            raise FileNotFoundError(f"The file {file_location} was not found.")

class Image(BaseModel):
    image_description: ClassVar[str] = """
    Identify the exact type of medical visualization or image with precise terminology.
    Classify from: line chart, bar graph, pie chart, scatter plot, table, flowchart,
    organizational chart, infographic, photograph, diagram, or other (specify).
    Include the chart's orientation if applicable (vertical/horizontal/radial).
    """

    summary_description: ClassVar[str] = """
    Provide details about the medical data in the image, including:
    1. All quantitative data points (exact numbers, percentages, values)
    2. Clear description of axes (variables, units, scales)
    3. Key trends (growth/decline patterns, correlations, anomalies)
    4. Time periods covered (if temporal data)
    5. Comparisons being made (between products, time periods, categories)
    6. Notable visual elements (annotations, highlights, outliers)
    7. The core medical insight or conclusion conveyed
    8. Any text labels or legends that appear in the image
    9. Confidence level in interpretation (high/medium/low)

    Structure as: [Data Summary] -> [Trend Analysis] -> [Key Takeaways]
    """

    image_type: str = Field(..., description=image_description)
    summary: str = Field(..., description=summary_description)
