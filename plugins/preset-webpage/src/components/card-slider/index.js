import loadComponents from './components';
import loadBlocks from './blocks';
import C from './consts';

export default (editor, opts = {}) => {
  const config = {
    blocks: [C.ref],
    minSlides: C.minSlides,
    maxSlides: C.maxSlides,
    ...opts,
  };

  loadComponents(editor, config);
  loadBlocks(editor, config);
};
