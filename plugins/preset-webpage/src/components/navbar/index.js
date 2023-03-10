import ezygrapes from 'ezygrapes';
import loadBlocks from './blocks';
import loadComponents from './components';
import {
  hNavbarRef
} from './consts';

export default ezygrapes.plugins.add('gjs-navbar', (editor, opts = {}) => {

  let config = {
    blocks: [hNavbarRef],
    defaultStyle: 1,
    navbarClsPfx: 'navbar',
    labelNavbar: 'Navbar',
    labelNavbarContainer: 'Navbar Container',
    labelMenu: 'Navbar Menu',
    labelMenuLink: 'Menu link',
    labelBurger: 'Burger',
    labelBurgerLine: 'Burger Line',
    labelNavbarBlock: 'Navbar',
    labelNavbarCategory: 'Extra',
    labelHome: 'Home',
    labelAbout: 'About',
    labelContact: 'Contact',
    ...opts,
  };

  loadComponents(editor, config);
  loadBlocks(editor, config);
});
