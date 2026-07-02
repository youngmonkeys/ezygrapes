export default (editor) => {
  editor.getInnerHtml = function () {
    const html = editor.getHtml();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body ? doc.body.innerHTML : html;
  };

  editor.getInnerCss = function () {
    return editor.getCss({ avoidProtected: true });
  };

  editor.generatePageFullHtml = function () {
    return generatePageFullHtml(
      this.getPageIconUrl ? this.getPageIconUrl() : '',
      this.getPageTitle ? this.getPageTitle() : '',
      this.getPageSummary ? this.getPageSummary() : '',
      this.getPageImageUrl ? this.getPageImageUrl() : '',
      this.getAdditionPageHeader ? this.getAdditionPageHeader() : '',
      this.getInnerHtml(),
      this.getAdditionPageFooter ? this.getAdditionPageFooter() : ''
    );
  };
};

function generatePageFullHtml(
  pageIconUrl,
  pageTitle,
  pageSummary,
  pageImageUrl,
  additionPageHeader,
  html,
  additionPageFooter,
) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${pageTitle || 'Preview'}</title>
      ${pageIconUrl ? `<link rel="icon" type="image/x-icon" href="${pageIconUrl}">` : ''}
      ${pageSummary ? `<meta property="og:description" content="${pageSummary}" />` : ''}
      ${pageImageUrl ? `<meta property="og:image" content="${pageImageUrl}">` : ''}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.13.1/font/bootstrap-icons.min.css">
      ${additionPageHeader || ''}
    </head>
    <body>
      ${html}

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.bundle.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js"></script>
      ${additionPageFooter || ''}
    </body>
    </html>
  `.trim();
}
