import ezygrapes from 'ezygrapes';
import loadComponents from './components';
import loadBlocks from './blocks';

export default ezygrapes.plugins.add('gjs-component-countdown', (editor, opts = {}) => {
  let config = {
    blocks: ['countdown'],
    defaultStyle: true,
    startTime: '',
    endText: editor.I18n.t('expired'),
    dateInputType: 'date',
    countdownClsPfx: 'countdown',
    ...opts,
  };

  loadComponents(editor, config);
  loadBlocks(editor, config);
});
