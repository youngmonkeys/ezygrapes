import ezygrapes from 'ezygrapes';
import loadBlocks from './blocks';
import loadComponents from './components';
import C from './consts';

export default ezygrapes.plugins.add(C.pluginId, (editor, opts = {}) => {
  const config = {
    blocks: [C.ref],
    ...opts,
  };
  loadComponents(editor, config);
  loadBlocks(editor, config);
});
