export default function(editor, opts = {}) {
  const domc = editor.DomComponents;
  const defaultType = domc.getType('default');
  const defaultModel = defaultType.model;
  const defaultView = defaultType.view;
  const pfx = opts.countdownClsPfx;
  const countdownType = 'countdown';

  domc.addType(countdownType, {

    model: defaultModel.extend({
      getDefaults: {
        ...defaultModel.prototype.defaults,
        startfrom: opts.startTime,
        endText: opts.endText,
        droppable: false,
        traits: [{
          label: 'Start',
          name: 'startfrom',
          changeProp: 1,
          type: opts.dateInputType,
        },{
          label: 'End text',
          name: 'endText',
          changeProp: 1,
        }],
        script: function() {
          var startfrom = '{[ startfrom ]}';
          var endTxt = '{[ endText ]}';
          var countDownDate = new Date(startfrom).getTime();
          var countdownEl = this.querySelector('[data-js=countdown]');
          var endTextEl = this.querySelector('[data-js=countdown-endtext]');
          var dayEl = this.querySelector('[data-js=countdown-day]');
          var hourEl = this.querySelector('[data-js=countdown-hour]');
          var minuteEl = this.querySelector('[data-js=countdown-minute]');
          var secondEl = this.querySelector('[data-js=countdown-second]');
          var oldInterval = this.gjs_countdown_interval;
          if(oldInterval) {
            oldInterval && clearInterval(oldInterval);
          }

          var setTimer = function (days, hours, minutes, seconds) {
            dayEl.innerHTML = days < 10 ? '0' + days : days;
            hourEl.innerHTML = hours < 10 ? '0' + hours : hours;
            minuteEl.innerHTML = minutes < 10 ? '0' + minutes : minutes;
            secondEl.innerHTML = seconds < 10 ? '0' + seconds : seconds ;
          }

          var moveTimer = function() {
            var now = new Date().getTime();
            var distance = countDownDate - now;
            var days = Math.floor(distance / 86400000);
            var hours = Math.floor((distance % 86400000) / 3600000);
            var minutes = Math.floor((distance % 3600000) / 60000);
            var seconds = Math.floor((distance % 60000) / 1000);

            setTimer(days, hours, minutes, seconds);

            /* If the count down is finished, write some text */
            if (distance < 0) {
              clearInterval(interval);
              endTextEl.innerHTML = endTxt;
              countdownEl.style.display = 'none';
              endTextEl.style.display = '';
            }
          };

          if (countDownDate) {
            var interval = setInterval(moveTimer, 1000);
            this.gjs_countdown_interval = interval;
            endTextEl.style.display = 'none';
            countdownEl.style.display = '';
            moveTimer();
          } else {
            setTimer(0, 0, 0, 0);
          }
        }
      },
    }, {
      isComponent(el) {
        if(el.getAttribute &&
          el.getAttribute('data-gjs-type') == countdownType) {
          return {
            type: countdownType
          };
        }
      },
    }),


    view: defaultView.extend({
      init() {
        this.listenTo(this.model, 'change:startfrom change:endText', this.updateScript);
        const comps = this.model.get('components');

        // Add a basic countdown template if it's not yet initialized
        if (!comps.length) {
          comps.reset();
          comps.add(`
            <span data-js="countdown" class="${pfx}-cont">
              <div class="${pfx}-block">
                <div data-js="countdown-day" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${opts.labelDays}</div>
              </div>
              <div class="${pfx}-block">
                <div data-js="countdown-hour" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${opts.labelHours}</div>
              </div>
              <div class="${pfx}-block">
                <div data-js="countdown-minute" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${opts.labelMinutes}</div>
              </div>
              <div class="${pfx}-block">
                <div data-js="countdown-second" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${opts.labelSeconds}</div>
              </div>
            </span>
            <span data-js="countdown-endtext" class="${pfx}-endtext"></span>
          `);
        }

      }
    }),
  });
}