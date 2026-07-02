export const buildSliders = (count, startId = 1) =>
  Array.from({ length: count }, (_, i) => ({ src: '', alt: `Card ${startId + i}`, href: '', id: startId + i }));

export const desktopSlideHtml = ({ src, alt, href, id }) => `
    <a id="slide-${id}" class="card-slider-slide" href="${href}" target="_self" data-gjs-type="card-slider-slide">
      <img src="${src}" alt="${alt}" data-gjs-type="image" />
    </a>
  `;

export const mobileSlideHtml = ({ src, alt, href, id }) => `
        <div class="swiper-slide">
          <a id="slide-${id}" class="card-slider-slide" href="${href}" target="_self" data-gjs-type="card-slider-slide">
            <img src="${src}" alt="${alt}" data-gjs-type="image" />
          </a>
        </div>
      `;

export const generateDesktopSlides = (sliders) => sliders.map(desktopSlideHtml).join('');
export const generateMobileSlides = (sliders) => sliders.map(mobileSlideHtml).join('');
