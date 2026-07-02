import C from './consts';
import styleSlider from './styles';

const sliders = [
  { src: '', alt: 'Card 1', href: '', id: 1 },
  { src: '', alt: 'Card 2', href: '', id: 2 },
  { src: '', alt: 'Card 3', href: '', id: 3 },
  { src: '', alt: 'Card 4', href: '', id: 4 },
  { src: '', alt: 'Card 5', href: '', id: 5 },
];

const generateDesktopSlides = () =>
  sliders
    .map(
      ({ src, alt, href, id }) => ` 
    <a id="slide-${id}" class="card-slider-slide" href="${href}" target="_self" data-gjs-type="card-slider-slide">
      <img src="${src}" alt="${alt}" data-gjs-type="image" />
    </a>
  `,
    )
    .join('');

const generateMobileSlides = () =>
  sliders
    .map(
      ({ src, alt, href, id }) => `
        <div class="swiper-slide">
          <a id="slide-${id}" class="card-slider-slide" href="${href}" target="_self" data-gjs-type="card-slider-slide">
            <img src="${src}" alt="${alt}" data-gjs-type="image" />
          </a>
        </div>
      `,
    )
    .join('');

export default (editor) => {
  const bm = editor.BlockManager;
  editor.addStyle(styleSlider);
  bm.add(C.ref, {
    label: editor.I18n.t(C.label),
    category: editor.I18n.t(C.category),
    attributes: { class: 'fa fa-images' },
    content: `
      <div class="slider-trigger-area">
       <div class="slider-top">
         <h2 data-gjs-type="text">Explore Our Series</h2>
         <h6 data-gjs-type="text">Discover the latest trends and insights</h6>
      </div>
        <div class="slider-wrapper-desktop">
          ${generateDesktopSlides()}
        </div>
        <div class="swiper card-swiper-custom">
          <div class="swiper-wrapper">
            ${generateMobileSlides()}
          </div>
        </div>
        <div class="slider-bottom-button">
          <a href="#" target="_self" data-gjs-type="link">Explore Series</a>
        </div>
      </div>
    `,
  });
};
