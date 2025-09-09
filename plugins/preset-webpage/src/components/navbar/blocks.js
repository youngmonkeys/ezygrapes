import {
  hNavbarRef,
  navbarRef,
  navbarItemsRef,
  menuRef
} from './consts';

export default (editor, opts = {}) => {
  const bm = editor.BlockManager;
  const navbarPfx = opts.navbarClsPfx || 'navbar';
  const style = opts.defaultStyle ? `
  <style>
    .navbar-toggler {
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .navbar-toggler:focus {
      box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
    }
    
    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.55%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }

    .btn-close-mobile-nav {
      display: none;
    }
    
    @media (max-width: 991.98px) {
      .navbar-collapse {
        position: fixed;
        top: 0;
        left: -100%;
        width: 300px;
        height: 100vh;
        background-color: #343a40;
        transition: left 0.3s ease-in-out;
        z-index: 1050;
        padding: 2rem 1rem;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      }
      
      .navbar-collapse.show {
        left: 0;
      }
      
      .navbar-nav {
        flex-direction: column;
        width: 100%;
      }
      
      .nav-item {
        margin: 0.5rem 0;
      }
      
      .nav-link {
        padding: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      
      .mobile-menu-header {
        display: flex;
        justify-content: flex-end;
        padding: 1rem 0;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        margin-bottom: 1rem;
      }
      
      .btn-close-mobile-nav {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: white;
        cursor: pointer;
        padding: 0.5rem;
        opacity: 0.8;
        transition: opacity 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
      }
      
      .btn-close-mobile-nav:hover {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      .btn-close-mobile-nav span {
        font-size: 1.5rem;
        line-height: 1;
      }
      
      .navbar-collapse.show::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.5);
        z-index: -1;
      }
    }
  </style>
  ` : '';

  if (opts.blocks.indexOf(hNavbarRef) >= 0) {
    bm.add(hNavbarRef, {
      label: `
        <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path class="gjs-block-svg-path" d="M22,9 C22,8.4 21.5,8 20.75,8 L3.25,8 C2.5,8 2,8.4 2,9 L2,15 C2,15.6 2.5,16 3.25,16 L20.75,16 C21.5,16 22,15.6 22,15 L22,9 Z M21,15 L3,15 L3,9 L21,9 L21,15 Z" fill-rule="nonzero"></path>
          <rect class="gjs-block-svg-path" x="15" y="10" width="5" height="1"></rect>
          <rect class="gjs-block-svg-path" x="15" y="13" width="5" height="1"></rect>
          <rect class="gjs-block-svg-path" x="15" y="11.5" width="5" height="1"></rect>
        </svg>
        <div class="gjs-block-label">${editor.I18n.t('navbar')}</div>`,
      category: editor.I18n.t('extra'),
      content: `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark"
          data-gjs-droppable="false"
          data-gjs-custom-name="${editor.I18n.t('navbar')}"
          data-gjs="${navbarRef}">
          <div class="container"
            data-gjs-droppable="false"
            data-gjs-draggable="false"
            data-gjs-copyable="false"
            data-gjs-highlightable="false"
            data-gjs-custom-name="${editor.I18n.t('navbar_container')}">

            <a class="navbar-brand" href="/" data-gjs-droppable="true">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEX///8ACgC/wb+fo58fKB/f4N9fZV9/hH8/Rz/0Vc1VAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACdUlEQVRoge2Xu3PTQBDGD8kiKdlEJCot80hLyPAoucxgUprEJikRkJgytiGmRBCG/NnoXjrpdN5BsQqY2a+wtfp0P61WtyeJMRKJRCKRSCQSiUQikUgk0n+q4KA7Vg9GxCIWsbplnVzdTJ/ZMNDhxG+jrJcg9MOEG1yEb1gIfZ+Nss4Aji6uAX7prDgMl1c5HGqWY6OsgMfiAk4hVvtTlcIXWEiWa6OsMbzX6b0WfxHfVfuzRLIcG2fleizLdsTvJlyq8C5IlmOjrBC+l4YYmybG4SJ2bZRlw0AOy7aMk4rBro2yUpt6LjD8ngnvCJZroyybB9sXpbFn3xQs10ZZNg/2VpRK3zYmit9v2hgrqlShB7W8BKthY6zA5lFc1Kh+jaOmjbFCM510Iiyv1N5j/z3rCWOzbRPu73hsjLVROUBuj03fRXzLY7dihWZBkI3YitUsyCyWQ0KeeO12LIg/Pjp+zuG8Latx0wO4kOso/PTaGCuCV+W2mASsl7CTzzwezv02xmo0SVrv4DY9xLJyPrHZbpPl2ijLrn2M3xfxNsNslGWXS7WE9uqzyLVRVlhWd6yeOxBPn04mq2yUZZ8J+inxUE2Jo69+G2WNddOcmWvYu1a0Q79dZ02XRgsmehg+FH+PISnPER0PHnwCNU09dpVlJfMvHoTxTfEOcVk/7p1yV9l+VnHOQvG5e2Cqi73CXqHgxXLRb+wtJ4HfbqdK/6ytvDnRb62sQ1aXeXVYr7Cypq4rXzO3UlSuOOXL5u1ZMNcbM18zt2TBcD5h0V4OnvfTljrluleT/tosFnyTtN/dfDVFg4NBd99fJBKJRCKRSKR/SH8AbfyCR3FmyV0AAAAASUVORK5CYII="
                alt="Brand" height="30"
                data-gjs-custom-name="${editor.I18n.t('logo')}">
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
              data-gjs-type="burger-menu" 
              data-gjs-custom-name="${editor.I18n.t('burger_menu')}">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav" data-gjs="${navbarItemsRef}"
              data-gjs-custom-name="${editor.I18n.t('links_container')}">
              <div class="mobile-menu-header"
                data-gjs-custom-name="${editor.I18n.t('menu_on_mobile')}">
                <button class="btn-close-mobile-nav" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Close navigation"
                  data-gjs-custom-name="${editor.I18n.t('close_button')}">
                  <span data-gjs-custom-name="${editor.I18n.t('close_icon')}">&times;</span>
                </button>
              </div>
              <ul class="navbar-nav" data-gjs="${menuRef}" data-gjs-custom-name="${editor.I18n.t('navbar_menu')}">
                <li class="nav-item"
                  data-gjs-custom-name="${editor.I18n.t('menu_item')}">
                  <a class="nav-link" href="#" data-gjs-custom-name="${editor.I18n.t('menu_link')}" data-gjs-draggable="[data-gjs=${menuRef}]">${editor.I18n.t('home')}</a>
                </li>
                <li class="nav-item"
                  data-gjs-custom-name="${editor.I18n.t('menu_item')}">
                  <a class="nav-link" href="#" data-gjs-custom-name="${editor.I18n.t('menu_link')}" data-gjs-draggable="[data-gjs=${menuRef}]">${editor.I18n.t('about')}</a>
                </li>
                <li class="nav-item"
                  data-gjs-custom-name="${editor.I18n.t('menu_item')}">
                  <a class="nav-link" href="#" data-gjs-custom-name="${editor.I18n.t('menu_link')}" data-gjs-draggable="[data-gjs=${menuRef}]">${editor.I18n.t('contact')}</a>
                </li>
              </ul>
            </div>

          </div>
        </nav>
        ${style}
      `,
    });
  }
}
