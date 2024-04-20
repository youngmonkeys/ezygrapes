import ezygrapes from 'ezygrapes';
import loadBlocks from './blocks';

export default ezygrapes.plugins.add('gjs-blocks-basic', (editor, opts = {}) => {
  const config = {
    blocks: [
      'column1',
      'column2',
      'column3',
      'column3-7',
      'text',
      'link',
      'image',
      'video',
      'embed',
      'map'
    ],
    flexGrid: 0,
    stylePrefix: 'gjs-',
    addBasicStyle: true,
    category: 'basic',
    rowHeight: 75,
    ...opts,
  };

  // Add blocks
  loadBlocks(editor, config);
});
