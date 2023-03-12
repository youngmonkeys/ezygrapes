export default (editor, opts) => {
  const bm = editor.BlockManager;
  const toAdd = name => opts.blocks.indexOf(name) >= 0;

  const categoryName = editor.I18n.t(opts.category) || opts.category;

  toAdd('link-block') && bm.add('link-block', {
    category: categoryName,
    label: editor.I18n.t('link_block'),
    attributes: { class: 'fas fa-link', style: 'font-size: 1.5rem; font-weight: 900'  },
    content: {
      type:'link',
      editable: false,
      droppable: true,
      style:{
        display: 'inline-block',
        padding: '5px',
        'min-height': '50px',
        'min-width': '50px'
      }
    },
  });

  toAdd('quote') && bm.add('quote', {
    label: editor.I18n.t('quote'),
    category: categoryName,
    attributes: { class: 'fas fa-quote-right', style: 'font-size: 1.5rem; font-weight: 900'  },
    content: `<blockquote class="quote">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit
      </blockquote>`
  });

  toAdd('text-basic') && bm.add('text-basic', {
    category: categoryName,
    label: editor.I18n.t('text_section'),
    attributes: { class: 'gjs-fonts gjs-f-h1p' },
    content: `<section class="bdg-sect">
      <h1 class="heading">Insert title here</h1>
      <p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
      </section>`
  });
}
