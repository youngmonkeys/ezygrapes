import ezygrapes from 'ezygrapes';
import loadBlocks from './blocks';
import loadComponents from './components';

export default ezygrapes.plugins.add('gjs-blocks-basic', (editor, opts = {}) => {
  const config = {
    blocks: [
      'container_fluid',
      'container',
      'column1',
      'column2',
      'column3',
      'column4',
      'column4-8',
      'empty_block',
      'text',
      'link',
      'image',
      'video',
      'embed',
      'map',
      'text-basic',
      'link-block',
      'quote',
      'list-basic',
      'ordered-list'
    ],
    category: 'basic',
    ...opts,
  };

  // Add blocks
  loadBlocks(editor, config);
  loadComponents(editor);
});
