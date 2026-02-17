/**
 * Generates and downloads a PDF document containing visa requirement guidelines.
 *
 * This function creates a formatted HTML document with visa requirements and document guidelines,
 * then triggers the browser's print dialog to save as PDF. The implementation uses a hidden iframe
 * to render the content without disrupting the user's current view.
 *
 * @param {any} visaRequirement - The visa requirement object containing:
 *   - toCountryName: Destination country name
 *   - visaType: Type of visa (e.g., Tourist, Business)
 *   - visaCategory: Category of visa
 *   - visaDocumentsGuidelines: Array of document categories with their requirements
 *
 * @example
 * downloadGuidelinePDF({
 *   toCountryName: "United States",
 *   visaType: "Tourist",
 *   visaCategory: "B-2",
 *   visaDocumentsGuidelines: [...]
 * });
 *
 * @returns {void}
 *
 * @remarks
 * - The function creates a temporary iframe that is removed after the print dialog is triggered
 * - Print styles are optimized for A4 page size with proper margins and borders
 * - The generated PDF includes a fixed border and footer on every page
 */
export const downloadGuidelinePDF = (visaRequirement: any) => {
  // Extract visa document guidelines from the requirement object
  // Default to empty array if guidelines are not present
  const guidelines = visaRequirement.visaDocumentsGuidelines || [];

  // Build the HTML template with embedded CSS for PDF generation
  // This includes print-specific styles for proper page layout and formatting

  /**
   * Initialize HTML document structure with embedded styles
   * The document includes:
   * - Responsive typography and spacing
   * - Print-optimized @media queries
   * - Fixed border and footer elements
   * - Table-based layout to handle page breaks properly
   */
  let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>${visaRequirement.toCountryName} - ${visaRequirement.visaType}</title>
          <style>
              body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.5; 
                  color: #333; 
                  padding: 40px; 
              }
              
              .header { 
                  text-align: center; 
                  margin-bottom: 30px; 
                  padding-bottom: 10px;
              }
              .header h1 h3 { color: #000000; margin: 0; }
              .header p { margin: 5px 0 0; color: #666; }
              
              .meta-info {
                  margin-bottom: 20px;
                  padding: 10px;
                  background-color: #f9f9f9;
                  border-radius: 4px;
                  font-size: 14px;
              }
              
              .category-block { 
                  margin-bottom: 30px; 
                  page-break-inside: avoid; 
              }
              .category-title { 
                  background-color: #f2f2f2; 
                  padding: 8px 15px; 
                  font-weight: bold; 
                  font-size: 24px; 
                  color: #000000;
              }
              
              .document-item { 
                  margin: 15px 0 20px 15px; 
              }
              .document-name { 
                  font-weight: bold; 
                  font-size: 22px; 
                  color: #000000; 
                  margin-bottom: 5px;
              }
              
              .requirements-list { margin: 5px 0; padding-left: 20px; }
              .requirements-list li { margin-bottom: 5px; font-size: 20px; }
              
              .links-section { 
                  font-size: 11px; 
                  color: #666; 
                  margin-top: 8px;
                  font-style: italic;
              }
              .links-section a { color: #2980b9; text-decoration: none; }
              
              .footer {
                  position: fixed;
                  bottom: 7mm; /* Position it above the bottom border */
                  width: 100%;
                  text-align: center;
                  font-size: 12px;
                  color: #888;
              }

              .page-border {
                  position: fixed;
                  top: 5mm; 
                  left: 5mm;
                  bottom: 5mm;
                  right: 5mm;
                  border: 2px solid #000;
                  pointer-events: none;
                  z-index: 9999;
              }
              
              .header-space {
                  height: 10mm; /* 5mm border + 20mm padding */
              }
              .footer-space {
                  height: 10mm;
              }

              @media print {
                  @page { margin: 0; } 
                  body { margin: 0; }
                  .footer { position: fixed; bottom: 7mm; }
                  .page-border { position: fixed; top: 5mm; left: 5mm; bottom: 5mm; right: 5mm; border: 2px solid #000; }
              }
          </style>
      </head>
      <body>
          <div class="page-border"></div>
          
          <!-- fixed footer is defined below, but we can leave it or move it. 
               The table method works with fixed elements overlaying. -->

          <table>
            <thead><tr><td><div class="header-space">&nbsp;</div></td></tr></thead>
            <tbody><tr><td>
                <div class="header">
                    <h1>${visaRequirement.toCountryName} Visa Requirements </h1>
                    <h2 style="font-size: 30px;"> Document Guidelines </h2>
                    <p>(${visaRequirement.visaCategory || ''} - ${visaRequirement.visaType || ''})</p>
                    <h2 style="font-size: 28px;"> Required Document </h2>
                    <p style="text-align:right; font-size: 14px; margin-top: 5px;">
                        Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
      `;

  /**
   * Iterate through document categories and build the document body
   * Each category contains multiple documents with their specific requirements
   */
  if (guidelines && guidelines.length > 0) {
    guidelines.forEach((category: any) => {
      // Create category block with title if category name exists
      if (category.docCategory) {
        htmlContent += `
              <div class="category-block">
                  <div class="category-title">${category.docCategory} - </div>
              `;
      } else {
        // Create category block without title for uncategorized documents
        htmlContent += `<div class="category-block">`;
      }

      // Render all documents within the current category
      if (category.documents && category.documents.length > 0) {
        category.documents.forEach((doc: any) => {
          htmlContent += `
                  <div class="document-item">
                      <div class="document-name">${doc.documentName}</div>
                      <ul class="requirements-list">
                          ${doc.requirements ? doc.requirements.map((req: string) => `<li>${req}</li>`).join('') : ''}
                      </ul>
                  </div>
                  `;
        });
      }
      htmlContent += `</div>`;
    });
  } else {
    // Display message when no guidelines are available
    htmlContent += `<p>No guidelines available.</p>`;
  }

  /**
   * Close the table structure and add fixed footer
   * The footer spacer ensures content doesn't overlap with the fixed footer element
   */
  htmlContent += `
            </td></tr></tbody>
            <tfoot><tr><td><div class="footer-space">&nbsp;</div></td></tr></tfoot>
        </table>

        <!-- Fixed elements -->
        <div class="footer">
            Powered by Intellivisa
        </div>
  `;

  // Close the HTML document
  htmlContent += `</body></html>`;

  /**
   * Create a hidden iframe element to render the PDF content
   * The iframe is positioned off-screen to avoid visual interference with the main page
   */
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  /**
   * Write the generated HTML content to the iframe document
   * This renders the content in an isolated environment
   */
  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(htmlContent);
    doc.close();

    /**
     * Trigger the browser's print dialog after a short delay
     * The timeout ensures all styles and content are fully loaded before printing
     *
     * @remarks
     * - window.print() is blocking in most browsers, so execution waits for user action
     * - The iframe is removed after printing to free up memory
     * - 500ms delay is sufficient for content rendering in most scenarios
     */
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Clean up: remove the iframe from DOM after print dialog is triggered
      document.body.removeChild(iframe);
    }, 500);
  } else {
    // Error handling: log failure if iframe document is not accessible
    console.error('Failed to access iframe document');
  }
};
