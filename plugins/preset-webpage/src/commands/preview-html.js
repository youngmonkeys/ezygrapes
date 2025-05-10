export default (editor, config) => {
  return {
    run(editor) {
      const exportedHtml = editor.generatePageFullHtml();
      const iframe = document.createElement('iframe');
      iframe.srcdoc = exportedHtml;

      Object.assign(iframe.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        zIndex: 9999,
      });

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = "<i class='fas fa-times'></i>";
      Object.assign(closeBtn.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 10000,
        padding: '8px 16px',
        fontSize: '16px',
        background: '#ff4d4f',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
      });

      closeBtn.onclick = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(closeBtn);
      };

      document.body.appendChild(iframe);
      document.body.appendChild(closeBtn);
    },
  };
};
