export default function(editor, opts = {}) {
  let bm = editor.BlockManager;
  let blocks = opts.blocks;
  let stylePrefix = opts.stylePrefix;
  const flexGrid = opts.flexGrid;
  const basicStyle = opts.addBasicStyle;
  const rowHeight = opts.rowHeight;
  const clsRow = `${stylePrefix}row`;
  const clsCell = `${stylePrefix}cell`;
  const styleRow = flexGrid
    ? `
    .${clsRow} {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: nowrap;
      padding: 10px;
    }
    @media (max-width: 768px) {
      .${clsRow} {
        flex-wrap: wrap;
      }
    }`
    : `
    .${clsRow} {
      display: table;
      padding: 10px;
      width: 100%;
    }
    @media (max-width: 768px) {
      .${stylePrefix}cell, .${stylePrefix}cell30, .${stylePrefix}cell70 {
        width: 100%;
        display: block;
      }
    }`;
  const styleClm = flexGrid
    ? `
    .${clsCell} {
      min-height: ${rowHeight}px;
      flex-grow: 1;
      flex-basis: 100%;
    }`
    : `
    .${clsCell} {
      width: 8%;
      display: table-cell;
      height: ${rowHeight}px;
    }`;
  const styleClm30 = `
  .${stylePrefix}cell30 {
    width: 30%;
  }`;
  const styleClm70 = `
  .${stylePrefix}cell70 {
    width: 70%;
  }`;

  const step = 0.2;
  const minDim = 1;
  const currentUnit = 1;
  const resizerBtm = {
    tl: 0,
    tc: 0,
    tr: 0,
    cl: 0,
    cr: 0,
    bl: 0,
    br: 0,
    minDim
  };
  const resizerRight = {
    ...resizerBtm,
    cr: 1,
    bc: 0,
    currentUnit,
    minDim,
    step
  };

  // Flex elements do not react on width style change therefore I use
  // 'flex-basis' as keyWidth for the resizer on columns
  if (flexGrid) {
    resizerRight.keyWidth = 'flex-basis';
  }

  const rowAttr = {
    class: clsRow,
    'data-gjs-droppable': `.${clsCell}`,
    'data-gjs-resizable': resizerBtm,
    'data-gjs-name': 'Row'
  };

  const colAttr = {
    class: clsCell,
    'data-gjs-draggable': `.${clsRow}`,
    'data-gjs-resizable': resizerRight,
    'data-gjs-name': 'Cell'
  };

  if (flexGrid) {
    colAttr['data-gjs-unstylable'] = ['width'];
    colAttr['data-gjs-stylable-require'] = ['flex-basis'];
  }

  // Make row and column classes private
  const privateCls = [`.${clsRow}`, `.${clsCell}`];
  editor.on(
    'selector:add',
    selector =>
      privateCls.indexOf(selector.getFullName()) >= 0 &&
      selector.set('private', 1)
  );

  const attrsToString = attrs => {
    const result = [];

    for (let key in attrs) {
      let value = attrs[key];
      const toParse = value instanceof Array || value instanceof Object;
      value = toParse ? JSON.stringify(value) : value;
      result.push(`${key}=${toParse ? `'${value}'` : `'${value}'`}`);
    }

    return result.length ? ` ${result.join(' ')}` : '';
  };

  const toAdd = name => blocks.indexOf(name) >= 0;
  const attrsRow = attrsToString(rowAttr);
  const attrsCell = attrsToString(colAttr);

  toAdd('column1') &&
    bm.add('column1', {
      label: opts.labelColumn1,
      category: opts.category,
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      content: `<div ${attrsRow}>
        <div ${attrsCell}></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
        </style>`
          : ''
      }`
    });

  toAdd('column2') &&
    bm.add('column2', {
      label: opts.labelColumn2,
      attributes: { class: 'gjs-fonts gjs-f-b2' },
      category: opts.category,
      content: `<div ${attrsRow}>
        <div ${attrsCell}></div>
        <div ${attrsCell}></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
        </style>`
          : ''
      }`
    });

  toAdd('column3') &&
    bm.add('column3', {
      label: opts.labelColumn3,
      category: opts.category,
      attributes: { class: 'gjs-fonts gjs-f-b3' },
      content: `<div ${attrsRow}>
        <div ${attrsCell}></div>
        <div ${attrsCell}></div>
        <div ${attrsCell}></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
        </style>`
          : ''
      }`
    });

  toAdd('column3-7') &&
    bm.add('column3-7', {
      label: opts.labelColumn37,
      category: opts.category,
      attributes: { class: 'gjs-fonts gjs-f-b37' },
      content: `<div ${attrsRow}>
        <div ${attrsCell} style='${
        flexGrid ? 'flex-basis' : 'width'
      }: 30%;'></div>
        <div ${attrsCell} style='${
        flexGrid ? 'flex-basis' : 'width'
      }: 70%;'></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
          ${styleClm30}
          ${styleClm70}
        </style>`
          : ''
      }`
    });

  toAdd('text') &&
    bm.add('text', {
      label: opts.labelText,
      category: opts.category,
      attributes: { class: 'gjs-fonts gjs-f-text' },
      content: {
        type: 'text',
        content: 'Insert your text here',
        style: { padding: '10px' },
        activeOnRender: 1
      }
    });

  toAdd('link') &&
    bm.add('link', {
      label: opts.labelLink,
      category: opts.category,
      attributes: { class: 'fas fa-link', style: 'font-size: 1.5rem; font-weight: 900' },
      content: {
        type: 'link',
        content: 'Link',
        style: { color: '#d983a6' }
      }
    });

  toAdd('image') &&
    bm.add('image', {
      label: opts.labelImage,
      category: opts.category,
      attributes: { class: 'gjs-fonts gjs-f-image' },
      content: {
        style: { color: 'black' },
        type: 'image',
        activeOnRender: 1
      }
    });

  toAdd('video') &&
    bm.add('video', {
      label: opts.labelVideo,
      category: opts.category,
      attributes: { class: 'fab fa-youtube', style: 'font-size: 1.5rem; font-weight: 900' },
      content: {
        type: 'video',
        src: 'img/video2.webm',
        style: {
          height: '350px',
          width: '615px'
        }
      }
    });

  toAdd('map') &&
    bm.add('map', {
      label: opts.labelMap,
      category: opts.category,
      attributes: { class: 'fas fa-map', style: 'font-size: 1.5rem; font-weight: 900' },
      content: {
        type: 'map',
        style: { height: '350px' }
      }
    });
}