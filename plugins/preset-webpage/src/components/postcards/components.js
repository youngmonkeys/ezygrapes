export default (editor) => {
  const domc = editor.DomComponents;
  const defaultView = domc.getType('default').view;

  domc.addType('image', {
    extend: 'image',
    model: {
      defaults: {
        draggable: false,
        droppable: false,
        traits: [
          {
            type: 'text',
            label: 'Image URL',
            name: 'src',
            changeProp: 1,
          },
          {
            type: 'text',
            label: 'Alt Text',
            name: 'alt',
            changeProp: 1,
          },
        ],
      },
    },
  });

  domc.addType('portcards', {
    model: {
      defaults: {
        name: 'Media Post Card',
        tagName: 'a',
        draggable: true,
        droppable: false,
        copyable: false,
        removable: false,
        attributes: {
          href: '#',
          target: '_self',
          class: 'portcards',
        },
        traits: [
          { type: 'text', name: 'href', label: 'Link URL', changeProp: 1 },
          {
            type: 'select',
            name: 'target',
            label: 'Mở trong',
            options: [
              { id: '_self', name: 'Cùng trang' },
              { id: '_blank', name: 'Tab mới' },
            ],
            changeProp: 1,
          },
          {
            type: 'select',
            name: 'postType',
            label: 'Loại bài viết',
            options: [
              { id: 'post', name: 'Bài viết' },
              { id: 'video', name: 'Video' },
              { id: 'podcast', name: 'Podcast' },
            ],
            changeProp: 1,
          },
        ],
        postType: 'post',
      },

      init() {
        const updateIcon = () => {
          const type = this.get('postType');
          const playIcon = this.find('.media-play-icon')[0];
          if (!playIcon) {
            return;
          };

          const show = ['video', 'podcast'].includes(type);
          playIcon.setStyle({ display: show ? 'block' : 'none' });
        };

        this.on('change:postType', updateIcon);
        updateIcon();

        this.on('change:href', () => this.addAttributes({ href: this.get('href') }));
        this.on('change:target', () => this.addAttributes({ target: this.get('target') }));

        this.components().forEach((child) => {
          child.set({ draggable: false, droppable: false, removable: false, copyable: false, editable: true });
        });
      },
    },
    view: defaultView,
  });
};
