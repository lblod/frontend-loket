import { reads } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  rol: reads('mandataris.bekleedt.bestuursfunctie.label'),
  start: reads('mandataris.start'),
  einde: reads('mandataris.einde'),
  fractie: reads('mandataris.heeftLidmaatschap.binnenFractie.naam'),
  rangorde: reads('mandataris.rangorde.content'),
  status: reads('mandataris.status.label'),
  beleidsdomein: reads('mandataris.beleidsdomein'),

  async didReceiveAttrs() {
    const beleidsdomein = await this.beleidsdomein;
    if (beleidsdomein.length) {
      const mappedBeleidsdomein = beleidsdomein.map(item => item.label);
      this.set('formattedBeleidsdomein', mappedBeleidsdomein.join(', '));
    } else {
      this.set('formattedBeleidsdomein', []);
    }
  },

  actions: {
    edit(){
      this.onEdit();
    },
    terminate(){
      this.onTerminate();
    },
    correct(){
      this.onCorrect();
    }
  }
});
