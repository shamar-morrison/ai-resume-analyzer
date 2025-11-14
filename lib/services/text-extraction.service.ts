import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extract text from a PDF file
 */
async function extractFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = new PDFParse({ data: buffer });
    const result = await pdfParse.getText();
    return result.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF file');
  }
}

/**
 * Extract text from a DOCX file
 */
async function extractFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
}

/**
 * Extract text from a file based on its type
 */
export async function extractText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // Determine file type and extract accordingly
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractFromPDF(buffer);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return extractFromDOCX(buffer);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }
}

/**
 * Validate extracted text
 */
export function validateExtractedText(text: string): void {
  if (!text || text.trim().length === 0) {
    throw new Error('No text could be extracted from the file. The file may be empty or corrupted.');
  }

  if (text.trim().length < 50) {
    throw new Error('Extracted text is too short. Please ensure the resume contains sufficient content.');
  }
}
