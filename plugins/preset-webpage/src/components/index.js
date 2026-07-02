export default (editor, config = {}) => {
  const domc = editor.DomComponents;

  domc.addType('image', {
    extend: 'image',
    // Without an explicit isComponent, GrapesJS's addType merge logic wipes
    // out the base image type's own <img> detection when extending it.
    isComponent: (el) => !!el.tagName && el.tagName.toLowerCase() === 'img',
    model: {
      defaults: {
        // The base image type defaults `src` to a placeholder SVG icon, which
        // GrapesJS renders as a base64 data URI when no real image is set.
        // Use a genuine empty string instead so unset images stay empty.
        src: '',
      },
    },
  });
};
