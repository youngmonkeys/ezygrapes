export default (editor, opts = {}) => {
  const dc = editor.DomComponents;
  const defaultType = dc.getType('default');
  const defaultModel = defaultType.model;
  const defaultView = defaultType.view;
  const burgerType = 'burger-menu';

  dc.addType(burgerType, {

    isComponent: el => {
      return el.classList?.contains('navbar-toggler');
    },

    model: {
      defaults: {
        ...defaultModel.prototype.defaults,
        'custom-name': editor.I18n.t('burger_menu'),
        droppable: false,
        copyable: false,
        removable: true,
        ...opts,
      },
    },

    view: defaultView,
  });
}
