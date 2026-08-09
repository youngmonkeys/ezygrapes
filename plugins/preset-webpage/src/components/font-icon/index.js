import loadBlocks from './blocks';

export default (editor, opts = {}) => {
  let config = {
    blocks: ['font-icon'],
    defaultStyle: true,
    cssClass: 'fa-solid fa-star',
    ...opts,
  };

  loadBlocks(editor, config);
};
