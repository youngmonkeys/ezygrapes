import C from './consts';
import { buildSliders, desktopSlideHtml, mobileSlideHtml } from './slide-template';

export default (editor, opts = {}) => {
  const minSlides = opts.minSlides || C.minSlides;
  const domc = editor.DomComponents;
  const defaultType = domc.getType('default');
  const defaultView = defaultType.view;

  domc.addType('card-slider', {
    isComponent: el => {
      if (el.classList?.contains('slider-trigger-area')) {
        return { type: 'card-slider' };
      }
    },
    model: {
      defaults: {
        name: 'Card Slider',
        traits: [
          {
            type: 'number',
            label: 'Number of slides',
            name: 'slidesCount',
            min: minSlides,
            changeProp: 1,
          },
        ],
      },
      getDesktopWrapper() {
        return this.findType((c) => c.getClasses().includes('slider-wrapper-desktop'), { max: 1 })[0];
      },
      getMobileWrapper() {
        return this.findType((c) => c.getClasses().includes('swiper-wrapper'), { max: 1 })[0];
      },
      init() {
        const desktopWrapper = this.getDesktopWrapper();
        const currentCount = desktopWrapper
          ? desktopWrapper.components().filter((c) => c.is('card-slider-slide')).length
          : minSlides;

        if (this.get('slidesCount') === undefined) {
          this.set('slidesCount', currentCount, { silent: true });
        }

        this.on('change:slidesCount', () => this.resizeSlides());
      },
      resizeSlides() {
        const desktopWrapper = this.getDesktopWrapper();
        const mobileWrapper = this.getMobileWrapper();
        if (!desktopWrapper || !mobileWrapper) return;

        const desktopSlides = desktopWrapper.components().filter((c) => c.is('card-slider-slide'));
        const currentCount = desktopSlides.length;

        let count = parseInt(this.get('slidesCount'), 10);
        if (isNaN(count)) return;
        count = Math.max(minSlides, count);
        if (count !== this.get('slidesCount')) {
          this.set('slidesCount', count, { silent: true });
        }

        if (count > currentCount) {
          buildSliders(count - currentCount, currentCount + 1).forEach((slider) => {
            desktopWrapper.append(desktopSlideHtml(slider));
            mobileWrapper.append(mobileSlideHtml(slider));
          });
        } else if (count < currentCount) {
          const toRemove = currentCount - count;
          desktopSlides.slice(-toRemove).forEach((s) => s.remove());
          const mobileSlides = mobileWrapper.components().filter((c) => c.getClasses().includes('swiper-slide'));
          mobileSlides.slice(-toRemove).forEach((s) => s.remove());
        }
      },
    },
  });

  domc.addType('card-slider-slide', {
    isComponent: el => {
      if (el.classList?.contains('card-slider-slide')) {
        return { type: 'card-slider-slide' };
      }
    },
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

          function getTransform(distance) {
            return {
              scale: Math.max(0.5, 1 - distance * 0.1),
              translateX: distance * 9.25,
              zIndex: Math.max(1, 10 - distance),
            };
          }

          function applyHoverEffect(siblings, index) {
            siblings.forEach((sib, idx) => {
              sib.style.transition = 'transform 0.3s ease, z-index 0.3s ease';

              const distance = Math.abs(idx - index);
              const direction = idx < index ? -1 : idx > index ? 1 : 0;
              const transform = getTransform(distance);

              sib.style.transform = `translate3d(${transform.translateX * direction}px, 0px, 0px) scale3d(${transform.scale}, ${transform.scale}, ${transform.scale})`;
              sib.style.zIndex = transform.zIndex;
            });
          }

          el.addEventListener('mouseenter', () => {
            const siblings = Array.from(el.parentElement.querySelectorAll('.card-slider-slide'));
            const index = siblings.indexOf(el);
            applyHoverEffect(siblings, index);
          });

          const siblings = Array.from(el.parentElement.querySelectorAll('.card-slider-slide'));
          const centerIndex = Math.floor((siblings.length - 1) / 2);
          if (siblings.length > 2) {
            applyHoverEffect(siblings, centerIndex);
          }
          if (typeof Swiper !== 'undefined') {
            new Swiper('.card-swiper-custom', {
              effect: 'cards',
              grabCursor: true,
              initialSlide: centerIndex,
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

  domc.addType('card-slider-image', {
    extend: 'image',
    model: {
      defaults: {
        // copyable: false,
        // pastable: false,
        draggable: false,
        droppable: false,
        // The base image type defaults `src` to a placeholder SVG icon, which
        // GrapesJS then renders as a base64 data URI. Use a real empty string
        // instead so an unset card image stays genuinely empty (no base64).
        src: '',
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

  const defaultDeleteCommand = editor.Commands.get('core:component-delete');
  const defaultPasteCommand = editor.Commands.get('core:paste');

  editor.Commands.add('core:component-delete', {
    run(editor, sender, options) {
      const selected = editor.getSelected();
      if (!selected) return defaultDeleteCommand.run(editor, sender, options);

      let target = selected;

      if (selected.is('card-slider-image')) {
        const parent = selected.parent();
        if (parent && parent.is('card-slider-slide')) {
          target = parent;
        }
      }

      let containerToDelete = target;
      const parent = target.parent();
      if (!parent) return defaultDeleteCommand.run(editor, sender, options);

      const isDesktop = !!parent.closest('.slider-wrapper-desktop');
      const isMobile = !!parent.closest('.swiper-wrapper');

      if (!isDesktop && !isMobile) {
        return defaultDeleteCommand.run(editor, sender, options);
      }

      if (isMobile) {
        alert('Please switch to desktop view to delete slides.');
        return;
      }

      let slides = [];

      if (isDesktop) {
        slides = parent.components().filter((comp) => comp.is('card-slider-slide'));
      }

      if (slides.length <= minSlides) {
        alert(`You must keep at least ${minSlides} slides.`);
        return;
      }

      const idx = slides.indexOf(containerToDelete);
      containerToDelete.remove();
      const mobileWrapper = editor.getWrapper().find('.card-swiper-custom .swiper-wrapper')[0];
      if (mobileWrapper) {
        const mobileSlides = mobileWrapper.components().filter((comp) => comp.getClasses().includes('swiper-slide'));
        const targetMobileSlide = mobileSlides[idx];
        if (targetMobileSlide) {
          targetMobileSlide.remove();
        }
      }
    },
  });

  editor.Commands.add('core:paste', {
    run(editor, sender, options) {
      const selected = editor.getSelected();
      if (!selected) return defaultPasteCommand.run(editor, sender, options);

      let target = selected;

      if (selected.is('card-slider-image')) {
        const parent = selected.parent();
        if (parent && parent.is('card-slider-slide')) {
          target = parent;
        }
      }

      const parent = target.parent();
      if (!parent) return defaultPasteCommand.run(editor, sender, options);

      const isDesktop = !!parent.closest('.slider-wrapper-desktop');
      const isMobile = !!parent.closest('.swiper-wrapper');

      if (!isDesktop && !isMobile) {
        return defaultPasteCommand.run(editor, sender, options);
      }

      if (isMobile) {
        alert('Please switch to desktop view to add slides.');
        return;
      }

      if (target.is('card-slider-slide')) {
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
      } else {
        alert('Only card-slides or images inside slides can be pasted.');
      }
    },
  });
  function syncDesktopToMobile(editor) {
    const desktopWrapper = editor.getWrapper().find('.slider-wrapper-desktop')[0];
    const mobileWrapper = editor.getWrapper().find('.card-swiper-custom .swiper-wrapper')[0];
    if (!desktopWrapper || !mobileWrapper) return;
  
    const desktopSlides = desktopWrapper.components().filter((comp) => comp.is('card-slider-slide'));
    const mobileSlides = mobileWrapper.components().filter((comp) => comp.getClasses().includes('swiper-slide'));
  
    desktopSlides.forEach((desktopSlide, idx) => {
      const mobileSlide = mobileSlides[idx];
      if (!mobileSlide) return;
  
      const mobileLink = mobileSlide.components().filter((comp) => comp.is('card-slider-slide'))[0];
      if (!mobileLink) return;
  
      const href = desktopSlide.get('href') || '';
      const target = desktopSlide.get('target') || '_self';
  
      mobileLink.set('href', href);
      mobileLink.set('target', target);
      mobileLink.addAttributes({ href, target });
  
      const desktopImg = desktopSlide.components().filter((comp) => comp.is('card-slider-image'))[0];
      const mobileImg = mobileLink.components().filter((comp) => comp.is('card-slider-image'))[0];
  
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
    if (!mobileWrapper || !desktopWrapper) return;
  
    const mobileSlides = mobileWrapper.components().filter((comp) => comp.getClasses().includes('swiper-slide'));
    const desktopSlides = desktopWrapper.components().filter((comp) => comp.is('card-slider-slide'));
  
    mobileSlides.forEach((mobileSlide, idx) => {
      const desktopSlide = desktopSlides[idx];
      if (!desktopSlide) return;
  
      const mobileLink = mobileSlide.components().filter((comp) => comp.is('card-slider-slide'))[0];
      if (!mobileLink) return;
  
      const href = mobileLink.get('href') || '';
      const target = mobileLink.get('target') || '_self';
  
      desktopSlide.set('href', href);
      desktopSlide.set('target', target);
      desktopSlide.addAttributes({ href, target });
  
      const mobileImg = mobileLink.components().filter((comp) => comp.is('card-slider-image'))[0];
      const desktopImg = desktopSlide.components().filter((comp) => comp.is('card-slider-image'))[0];
  
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
    if (!model) return;
    if (!model.is('card-slider-slide') && !model.is('card-slider-image')) return;

    const parent = model.parent();
    if (!parent) return;

    const isDesktop = !!parent.closest('.slider-wrapper-desktop');
    const isMobile = !!parent.closest('.swiper-wrapper');

    if (isDesktop) {
      syncDesktopToMobile(editor);
    } else if (isMobile) {
      syncMobileToDesktop(editor);
    }
  });
};
