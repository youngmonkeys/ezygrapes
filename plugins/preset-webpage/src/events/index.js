export default (editor) => {
  editor.on('load', (editor) => {
    addZIndexProperty(editor);
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