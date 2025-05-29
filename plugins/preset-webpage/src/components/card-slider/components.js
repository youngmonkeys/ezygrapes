export default (editor) => {
  const domc = editor.DomComponents;
  const defaultType = domc.getType('default');
  const defaultView = defaultType.view;

  domc.addType('card-slider-slide', {
    model: {
      defaults: {
        name: 'Card Slide',
        tagName: 'a',
        draggable: false,
        droppable: false,
        traits: [
          {
            type: 'text',
            label: 'Link URL',
            name: 'href',
            placeholder: 'https://your-link.com',
            changeProp: 1,
          },
          {
            type: 'select',
            label: 'Link Target',
            name: 'target',
            options: [
              { id: '_self', name: 'Same Tab' },
              { id: '_blank', name: 'New Tab' },
            ],
          },
        ],
        attributes: {
          href: '',
          target: '_self',
        },
        script: function () {
          const el = this;

          const transformMap = [
            { scale: 1, translateX: 0, zIndex: 10 },
            { scale: 0.9, translateX: 9.25, zIndex: 9 },
            { scale: 0.8, translateX: 18.5, zIndex: 8 },
            { scale: 0.7, translateX: 27.75, zIndex: 7 },
            { scale: 0.6, translateX: 37, zIndex: 6 },
          ];

          function applyHoverEffect(siblings, index) {
            siblings.forEach((sib, idx) => {
              sib.style.transition = 'transform 0.3s ease, z-index 0.3s ease';

              const distance = Math.abs(idx - index);
              const transform = transformMap[distance];

              if (transform) {
                sib.style.transform = `translate3d(${transform.translateX}px, 0px, 0px) scale3d(${transform.scale}, ${transform.scale}, ${transform.scale})`;
                sib.style.zIndex = transform.zIndex;
              } else {
                sib.style.transform = '';
                sib.style.zIndex = '';
              }
            });
          }

          el.addEventListener('mouseenter', () => {
            const siblings = Array.from(el.parentElement.querySelectorAll('.card-slider-slide'));
            const index = siblings.indexOf(el);
            applyHoverEffect(siblings, index);
          });

          const siblings = Array.from(el.parentElement.querySelectorAll('.card-slider-slide'));
          if (siblings.length > 2) {
            applyHoverEffect(siblings, 2);
          }
          if (typeof Swiper !== 'undefined') {
            new Swiper('.card-swiper-custom', {
              effect: 'cards',
              grabCursor: true,
              initialSlide: 2,
              loop: true,
              loopAdditionalSlides: 1,
              speed: 600,
              cardsEffect: {
                perSlideRotate: 0,
                perSlideOffset: 15,
              },
            });
          }
        },
      },
      init() {
        this.on('change:href', () => {
          const href = this.get('href');
          if (href !== undefined) {
            this.addAttributes({ href });
          }
        });

        this.on('change:target', () => {
          const target = this.get('target') || '_self';
          if (target !== undefined) {
            this.addAttributes({ target });
          }
        });
      },
    },
    view: defaultView,
  });

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
            placeholder: 'https://your-image.com/image.png',
            changeProp: 1,
          },
          {
            type: 'text',
            label: 'Alt Text',
            name: 'alt',
            placeholder: 'Description',
            changeProp: 1,
          },
        ],
      },
    },
  });

  const originalDeleteCommand = editor.Commands.get('core:component-delete');

  editor.Commands.add('core:component-delete', {
    run(editor, sender, options) {
      const selected = editor.getSelected();
      if (!selected) {
        return;
      };
  
      let target = selected;
  
      if (target.is('image')) {
        const parent = target.parent();
        if (parent && parent.is('card-slider-slide')) {
          target = parent;
        }
      }
  
      if (!target.is('card-slider-slide')) {
        originalDeleteCommand.run(editor, sender, options);
        return;
      }
  
      const parent = target.parent();
      if (!parent) {
        return;
      };
  
      const isDesktop = !!parent.closest('.slider-wrapper-desktop');
      const isMobile = !!parent.closest('.swiper-wrapper');
  
      if (isMobile) {
        alert(editor.I18n.t("errors.card_slider.mobile_delete"))
        return;
      }
  
      let slides = [];
  
      if (isDesktop) {
        slides = parent.components().filter((comp) => comp.is('card-slider-slide'));
      }
  
      if (slides.length <= 3) {
        alert(editor.I18n.t("errors.card_slider.item_min"));
        return;
      }
  
      const idx = slides.indexOf(target);
      target.remove();
  
      const mobileWrapper = editor.getWrapper().find('.card-swiper-custom .swiper-wrapper')[0];
      if (mobileWrapper) {
        const mobileSlides = mobileWrapper.components().filter((comp) =>
          comp.getClasses().includes('swiper-slide')
        );
        const targetMobileSlide = mobileSlides[idx];
        if (targetMobileSlide) {
          targetMobileSlide.remove();
        }
      }
    }
  });

  const originalPasteCommand = editor.Commands.get('core:paste');

  editor.Commands.add('core:paste', {
    run(editor) {
      const selected = editor.getSelected();
      if (!selected) {
        return;
      };
  
      let target = selected;
  
      if (target.is('image')) {
        const parent = target.parent();
        if (parent && parent.is('card-slider-slide')) {
          target = parent;
        }
      }
  
      if (!target.is('card-slider-slide')) {
        originalPasteCommand.run(editor);
        return;
      }
  
      const parent = target.parent();
      if (!parent) {
        return;
      };
  
      const isDesktop = !!parent.closest('.slider-wrapper-desktop');
      const isMobile = !!parent.closest('.swiper-wrapper');
  
      if (isMobile) {
        alert(editor.I18n.t("errors.card_slider.mobile_add"))
        return;
      }
  
      let slides = [];
  
      if (isDesktop) {
        slides = parent.components().filter((comp) => comp.is('card-slider-slide'));
      }
  
      if (slides.length >= 5) {
        alert(editor.I18n.t("errors.card_slider.item_max"));
        return;
      }
  
      const cloned = target.clone();
      parent.append(cloned);
      editor.select(cloned);
  
      const mobileWrapper = editor.getWrapper().find('.card-swiper-custom .swiper-wrapper')[0];
      if (mobileWrapper) {
        mobileWrapper.append({
          tagName: 'div',
          attributes: { class: 'swiper-slide' },
          components: [
            {
              type: 'card-slider-slide',
              attributes: cloned.getAttributes(),
              components: cloned.components().map((child) => child.toJSON()),
            },
          ],
        });
      }
    }
  });
  
  function syncDesktopToMobile(editor) {
    const desktopWrapper = editor.getWrapper().find('.slider-wrapper-desktop')[0];
    const mobileWrapper = editor.getWrapper().find('.card-swiper-custom .swiper-wrapper')[0];
    if (!desktopWrapper || !mobileWrapper) {
      return;
    };
  
    const desktopSlides = desktopWrapper.components().filter((comp) => comp.is('card-slider-slide'));
    const mobileSlides = mobileWrapper.components().filter((comp) => comp.getClasses().includes('swiper-slide'));
  
    desktopSlides.forEach((desktopSlide, idx) => {
      const mobileSlide = mobileSlides[idx];
      if (!mobileSlide) {
        return;
      };
  
      const mobileLink = mobileSlide.components().filter((comp) => comp.is('card-slider-slide'))[0];
      if (!mobileLink) {
        return;
      };
  
      const href = desktopSlide.get('href') || '';
      const target = desktopSlide.get('target') || '_self';
  
      mobileLink.set('href', href);
      mobileLink.set('target', target);
      mobileLink.addAttributes({ href, target });
  
      const desktopImg = desktopSlide.components().filter((comp) => comp.is('image'))[0];
      const mobileImg = mobileLink.components().filter((comp) => comp.is('image'))[0];
  
      if (desktopImg && mobileImg) {
        const src = desktopImg.get('src') || '';
        const alt = desktopImg.get('alt') || '';
  
        mobileImg.set('src', src);
        mobileImg.set('alt', alt);
        mobileImg.addAttributes({ src, alt });
      }
    });
  }
  function syncMobileToDesktop(editor) {
    const mobileWrapper = editor.getWrapper().find('.card-swiper-custom .swiper-wrapper')[0];
    const desktopWrapper = editor.getWrapper().find('.slider-wrapper-desktop')[0];
    if (!mobileWrapper || !desktopWrapper) {
      return;
    };
  
    const mobileSlides = mobileWrapper.components().filter((comp) => comp.getClasses().includes('swiper-slide'));
    const desktopSlides = desktopWrapper.components().filter((comp) => comp.is('card-slider-slide'));
  
    mobileSlides.forEach((mobileSlide, idx) => {
      const desktopSlide = desktopSlides[idx];
      if (!desktopSlide) {
        return;
      };
  
      const mobileLink = mobileSlide.components().filter((comp) => comp.is('card-slider-slide'))[0];
      if (!mobileLink) {
        return;
      };
  
      const href = mobileLink.get('href') || '';
      const target = mobileLink.get('target') || '_self';
  
      desktopSlide.set('href', href);
      desktopSlide.set('target', target);
      desktopSlide.addAttributes({ href, target });
  
      const mobileImg = mobileLink.components().filter((comp) => comp.is('image'))[0];
      const desktopImg = desktopSlide.components().filter((comp) => comp.is('image'))[0];
  
      if (mobileImg && desktopImg) {
        const src = mobileImg.get('src') || '';
        const alt = mobileImg.get('alt') || '';
  
        desktopImg.set('src', src);
        desktopImg.set('alt', alt);
        desktopImg.addAttributes({ src, alt });
      }
    });
  }
  editor.on('component:update:attributes', (model) => {
    if (!model) {
      return;
    };
    if (!model.is('card-slider-slide') && !model.is('image')) {
      return;
    };

    const parent = model.parent();
    if (!parent) {
      return;
    };

    const isDesktop = !!parent.closest('.slider-wrapper-desktop');
    const isMobile = !!parent.closest('.swiper-wrapper');

    if (isDesktop) {
      syncDesktopToMobile(editor);
    } else if (isMobile) {
      syncMobileToDesktop(editor);
    }
  });
};
