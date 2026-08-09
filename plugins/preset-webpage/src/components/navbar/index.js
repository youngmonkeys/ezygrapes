import loadBlocks from './blocks';
import loadComponents from './components';
import {
  hNavbarRef
} from './consts';

export default (editor, opts = {}) => {

  let config = {
    blocks: [hNavbarRef],
    defaultStyle: 1,
    navbarClsPfx: 'navbar',
    ...opts,
  };

  loadComponents(editor, config);
  loadBlocks(editor, config);
};
