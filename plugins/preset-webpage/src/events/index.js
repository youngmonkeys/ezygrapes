export default (editor) => {
  editor.on('load', () => {
    addFontOptions(editor);
    addZIndexProperty(editor);
    addFontFacess(editor);
  });
  editor.on('component:add', (component) => {
    if (component.is('image') && !component.getStyle()['object-fit']) {
        component.addStyle({ 'object-fit': 'cover' });
    }
  });
  editor.on('component:selected', model => {
    if (model.is('image')) {
      const sm = editor.StyleManager;
      const sector = sm.getSector('extra') || sm.addSector('extra', { name: 'Extra', open: true });
      const propertyExists = sector.getProperties().some(prop => prop.get('property') === 'object-fit');
      if (!propertyExists) {
      sm.addProperty(sector.getId(), {
        name: 'Object Fit',
        property: 'object-fit',
        type: 'select',
        defaults: 'cover',
        full: true,
        options: [
        { value: 'fill', name: 'fill' },
        { value: 'contain', name: 'contain' },
        { value: 'cover', name: 'cover' },
        { value: 'none', name: 'none' },
        { value: 'scale-down', name: 'scale-down' }
        ]
      });
      }
    }
    const styles = model.getStyle();
    const display = styles.display;
  
    if (display === 'flex') {
      addFlexAttributes(editor);
    }

    addOnclickEvent(editor, model);
  });

  editor.on('style:property:update', ({ property, value }) => {
    if (property.id === 'display' && value === 'flex') {
      addFlexAttributes(editor);
    }
  });
}

function addFlexAttributes(editor) {
  const sm = editor.StyleManager;
  const sectors = sm.getSectors();

  const flexSector = sectors.find(sector => sector.get('name') === 'Flex');
  if (flexSector) {
    const properties = flexSector.get('properties');

    const propsToAdd = [
      { property: 'gap', label: editor.I18n.t('gap') },
      { property: 'row-gap', label: editor.I18n.t('row_gap') },
      { property: 'column-gap', label: editor.I18n.t('column_gap') },
    ];

    propsToAdd.forEach(({ property, label }) => {
      const alreadyExists = properties.find(prop => prop.get('property') === property);
      if (!alreadyExists) {
        properties.add({
          property,
          label,
          type: 'integer',
          units: ['px', 'rem', '%'],
          defaults: 'auto',
          min: 0,
        });
      }
    });
  }
}

function addFontOptions(editor) {
  const config = editor.getConfig();
  const fonts = config.fonts;
  if (!fonts) {
    return;
  }
  const sm = editor.StyleManager;
  const typographyProps = sm
    .getSectors()
    .find(sector => sector.get('id') === 'typography')
    .get('properties');
  const fontProp = typographyProps
    .find(prop => prop.get('property') === 'font-family');
  if (fontProp) {
    const currentList = fontProp.get('options') || [];
    fonts.forEach((font) => {
      const id = font.id || font.name;
      const label = font.label || font.displayName || id;

      const alreadyExists = currentList.some(f => f.label === label);
      if (!alreadyExists) {
        currentList.push({ id: id, label: label });
        fontProp.set('options', currentList);
      }
    });
    if (fontProp.view) {
      fontProp.view.render();
    }
  }
}

function addFontFacess(editor) {
  const config = editor.getConfig();
  const fonts = config.fonts;
  if (!fonts) {
    return;
  }
  const head = editor.Canvas.getDocument().head;
  const style = document.createElement('style');
  var html = '';
  fonts.forEach((font) => {
    const id = font.id || font.name;
    const urls = font.sources || font.urls;
    urls.forEach((item) => {
      var url = item.src || item.url;
      var format = font.format;
      if (!format && url.endsWith('.woff')) {
        format = 'woff';
      }
      if (!format && url.endsWith('.woff2')) {
        format = 'woff2';
      }
      if (!format) {
        format = 'truetype';
      }
      const settings = item.settings || item.config;
      html += `
        @font-face {
          font-family: '${id}';
          src: url('${url}') format('${format}');
          ${settings || ''}
        }
      `;
    });
  });
  style.innerHTML = html;
  head.appendChild(style);
}

function addZIndexProperty(editor) {
  const sm = editor.StyleManager;

  sm.addProperty('extra', {
    name: 'z-index',
    property: 'z-index',
    type: 'integer',
    defaults: '1',
    full: true,
    attributes: { class: 'gjs-width-100' }
  });
}

function addOnclickEvent(editor, component) {
  if (!component || component.is('wrapper')) {
    return;
  }
  const traits = component.get('traits') || [];
  const hasOnclickTrait = traits.some(trait => trait.name === 'onclick');
  if (!hasOnclickTrait) {
    component.addTrait({
      name: 'onclick',
      label: editor.I18n.t('on_click'),
      type: 'text',
      placeholder: "e.g., alert('Hello')"
    });
  }
}