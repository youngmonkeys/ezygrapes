import ezygrapes from 'ezygrapes';
import loadComponents from './components';
import loadBlocks from './blocks';
import {
  countdownRef
} from './consts';

export default ezygrapes.plugins.add('gjs-component-countdown', (editor, opts = {}) => {
  let config = {
    blocks: [countdownRef],
    defaultStyle: true,
    startTime: '',
    endText: 'EXPIRED',
    dateInputType: 'date',
    countdownClsPfx: 'countdown',
    labelCountdown: 'Countdown',
    labelCountdownCategory: 'Extra',
    labelDays: 'days',
    labelHours: 'hours',
    labelMinutes: 'minutes',
    labelSeconds: 'seconds',
    ...opts,
  };

  loadComponents(editor, config);
  loadBlocks(editor, config);
});
