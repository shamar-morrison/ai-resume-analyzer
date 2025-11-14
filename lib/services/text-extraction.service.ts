import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

/**
 * Extract text from a PDF file
 */
async function extractFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty or invalid PDF buffer');
    }

    // Validate PDF header
    const header = buffer.toString('utf-8', 0, 5);
    if (!header.startsWith('%PDF-')) {
      throw new Error('Invalid PDF file: Missing PDF header. The file may be corrupted or not a valid PDF.');
    }

    // Import PDF.js worker for Node.js environment (legacy build)
    // @ts-ignore - Dynamic import needed for worker setup
    await import('pdfjs-dist/legacy/build/pdf.worker.mjs');

    // Convert Buffer to Uint8Array for pdfjs-dist
    const uint8Array = new Uint8Array(buffer);

    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      verbosity: 0, // Suppress warnings
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;

    let fullText = '';

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine all text items from the page
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      fullText += pageText + '\n';
    }

    // Clean up
    await pdfDocument.destroy();

    const extractedText = fullText.trim();

    if (!extractedText) {
      throw new Error('No text content found in PDF. The PDF may be scanned images without a text layer.');
    }

    return extractedText;
  } catch (error) {
    // Provide more specific error messages
    if (error instanceof Error) {
      // Re-throw our custom errors
      if (error.message.includes('Invalid PDF file') ||
          error.message.includes('No text content found') ||
          error.message.includes('Empty or invalid')) {
        throw error;
      }
      // Wrap other errors with context
      throw new Error(`Failed to extract text from PDF file: ${error.message}`);
    }

    throw new Error('Failed to extract text from PDF file: Unknown error');
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
