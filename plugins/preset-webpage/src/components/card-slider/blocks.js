import C from './consts';
import styleSlider from './styles';
import { buildSliders, generateDesktopSlides, generateMobileSlides } from './slide-template';

export default (editor, opts = {}) => {
  const bm = editor.BlockManager;
  const sliders = buildSliders(opts.maxSlides || C.maxSlides);
  editor.addStyle(styleSlider);
  bm.add(C.ref, {
    label: editor.I18n.t(C.label),
    category: editor.I18n.t(C.category),
    attributes: { class: 'fa fa-images' },
    content: `
      <div class="slider-trigger-area" data-gjs-type="card-slider" data-slides-count="${sliders.length}">
       <div class="slider-top">
         <h2 data-gjs-type="text">Explore Our Series</h2>
         <h6 data-gjs-type="text">Discover the latest trends and insights</h6>
      </div>
        <div class="slider-wrapper-desktop">
          ${generateDesktopSlides(sliders)}
        </div>
        <div class="swiper card-swiper-custom">
          <div class="swiper-wrapper">
            ${generateMobileSlides(sliders)}
          </div>
        </div>
        <div class="slider-bottom-button">
          <a href="#" target="_self" data-gjs-type="link">Explore Series</a>
        </div>
      </div>
    `,
  });
};
