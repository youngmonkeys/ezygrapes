import ezygrapes from 'ezygrapes';

export default ezygrapes.plugins.add('gjs-plugin-filestack', (editor, opts = {}) => {
  let config = editor.getConfig();
  let pfx = config.stylePrefix || '';
  let btnEl;

  let settings = {
    // Filestack's API key
    key: '',

    // Custom button element which triggers Filestack modal
    btnEl: '',

    // Text for the button in case the custom one is not provided
    btnText: 'Add images',

    // Filestack's options
    filestackOpts: {
      accept: 'image/*',
      maxFiles: 10
    },

    // On complete upload callback
    // blobs - Array of Objects, eg. [{url:'...', filename: 'name.jpeg', ...}]
    // assets - Array of inserted assets
    // for debug: console.log(JSON.stringify(blobs));
    onComplete: (blobs, assets) => {},

    ...opts,
  };

  if(!filestack) {
    throw new Error('Filestack instance not found');
  }

  if(!settings.key){
    throw new Error('Filestack\'s API key not found');
  }

  const fsClient = filestack.init(settings.key);


  // When the Asset Manager modal is opened
  editor.on('run:open-assets', () => {
    const modal = editor.Modal;
    const modalBody = modal.getContentEl();
    const uploader = modalBody.querySelector('.' + pfx + 'am-file-uploader');
    const assetsHeader = modalBody.querySelector('.' + pfx + 'am-assets-header');
    const assetsBody = modalBody.querySelector('.' + pfx + 'am-assets-cont');

    uploader && (uploader.style.display = 'none');
    assetsHeader && (assetsHeader.style.display = 'none');
    assetsBody.style.width = '100%';

    // Instance button if not yet exists
    if(!btnEl) {
      btnEl = settings.btnEl;

      if(!btnEl) {
        btnEl = document.createElement('button');
        btnEl.className = pfx + 'btn-prim ' + pfx + 'btn-filestack';
        btnEl.innerHTML = settings.btnText;
      }

      btnEl.onclick = () => {
        fsClient.pick(settings.filestackOpts).then((objs) => {
          const blob = objs.filesUploaded;
          const blobs = blob instanceof Array ? blob : [blob];
          let assets = addAssets(blobs);
          settings.onComplete(blobs, assets);
        });
      };
    }

    assetsBody.insertBefore(btnEl, assetsHeader);
  });

  /**
   * Add new assets to the editor
   * @param {Array} files
   */
  const addAssets = (files) => {
    const urls = files.map((file) => {
        file.src = file.url;
        return file;
    });
    return editor.AssetManager.add(urls);
  };

});
