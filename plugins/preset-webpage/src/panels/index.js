import {
  cmdEditHtml,
  cmdImport,
  cmdDeviceDesktop,
  cmdDeviceTablet,
  cmdDeviceMobile,
  cmdClear,
  cmdPreviewHtml,
} from './../consts';

export default (editor, config) => {
  const pn = editor.Panels;
  const eConfig = editor.getConfig();
  const swv = 'sw-visibility';
  const expt = 'export-template';
  const osm = 'open-sm';
  const otm = 'open-tm';
  const ola = 'open-layers';
  const obl = 'open-blocks';
  const ful = 'fullscreen';
  const prv = 'preview';

  eConfig.showDevices = 0;

  pn.getPanels().reset([
    {
      id: 'commands',
      buttons: [{}],
    },
    {
      id: 'options',
      buttons: [
        {
          id: swv,
          command: swv,
          context: swv,
          className: 'far fa-square',
        },
        {
          id: prv,
          context: prv,
          command: (e) => e.runCommand(prv),
          className: 'fas fa-eye',
        },
        {
          id: ful,
          command: ful,
          context: ful,
          className: 'fas fa-arrows-alt',
        },
        {
          id: expt,
          className: 'fas fa-code',
          command: (e) => e.runCommand(expt),
        },
        {
          id: cmdPreviewHtml,
          className: 'fa-solid fa-up-right-from-square',
          command: (e) => e.runCommand(cmdPreviewHtml),
        },
        {
          id: 'editHtml',
          className: 'fa fa-edit',
          command: (e) => e.runCommand(cmdEditHtml),
        },
        {
          id: 'undo',
          className: 'fas fa-undo',
          command: (e) => e.runCommand('core:undo'),
        },
        {
          id: 'redo',
          className: 'fas fa-redo',
          command: (e) => e.runCommand('core:redo'),
        },
        {
          id: cmdImport,
          className: 'fas fa-download',
          command: (e) => e.runCommand(cmdImport),
        },
        {
          id: cmdClear,
          className: 'fas fa-trash',
          command: (e) => e.runCommand(cmdClear),
        },
      ],
    },
    {
      id: 'views',
      buttons: [
        {
          id: osm,
          command: osm,
          active: true,
          className: 'fas fa-paint-brush',
        },
        {
          id: otm,
          command: otm,
          className: 'fas fa-cog',
        },
        {
          id: ola,
          command: ola,
          className: 'fas fa-bars',
        },
        {
          id: obl,
          command: obl,
          className: 'fas fa-th-large',
        },
      ],
    },
  ]);

  // Add devices buttons
  const panelDevices = pn.addPanel({ id: 'devices-c' });
  panelDevices.get('buttons').add([
    {
      id: cmdDeviceDesktop,
      command: cmdDeviceDesktop,
      className: 'fas fa-desktop',
      active: 1,
    },
    {
      id: cmdDeviceTablet,
      command: cmdDeviceTablet,
      className: 'fas fa-tablet-alt',
    },
    {
      id: cmdDeviceMobile,
      command: cmdDeviceMobile,
      className: 'fas fa-mobile-alt',
    },
  ]);

  const openBl = pn.getButton('views', obl);
  editor.on('load', () => openBl && openBl.set('active', 1));

  editor.on('load', () => {
    const blockManager = editor.BlockManager;
    const bmContainer = blockManager
      && blockManager.getContainer
      && blockManager.getContainer();
    if (!bmContainer) {
      return;
    }

    if (bmContainer.querySelector('.gjs-blocks-search')) {
      return;
    }

    const i18n = editor.I18n;
    const placeholder = i18n.t('search_blocks');

    const searchWrap = document.createElement('div');
    searchWrap.className = 'gjs-blocks-search';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;

    let debounceTimer;
    const debounce = (fn, wait) => {
      return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => fn.apply(null, args), wait);
      };
    };

    const filterBlocks = (query) => {
      const q = (query || '').toLowerCase().trim();
      const blockEls = bmContainer.querySelectorAll('.gjs-block');

      blockEls.forEach((el) => {
        const text = (el.textContent || '').toLowerCase();
        const matches = !q || text.includes(q);
        el.style.display = matches ? '' : 'none';
      });

      const categories = bmContainer.querySelectorAll('.gjs-block-category');
      categories.forEach((cat) => {
        const inner = cat.querySelector('.gjs-blocks-c');
        if (!inner) {
          return;
        }
        const anyVisible = Array
          .from(inner.querySelectorAll('.gjs-block'))
          .some((b) => b.style.display !== 'none');
        cat.style.display = anyVisible ? '' : 'none';
      });
    };

    input.addEventListener(
      'input',
      debounce((e) => filterBlocks(e.target.value), 120)
    );

    searchWrap.appendChild(input);
    bmContainer.prepend(searchWrap);
  });

  config.showStylesOnChange &&
    editor.on('component:selected', () => {
      const openSmBtn = pn.getButton('views', osm);
      const openLayersBtn = pn.getButton('views', ola);

      if ((!openLayersBtn || !openLayersBtn.get('active')) && editor.getSelected()) {
        openSmBtn && openSmBtn.set('active', 1);
      }
    });
};
