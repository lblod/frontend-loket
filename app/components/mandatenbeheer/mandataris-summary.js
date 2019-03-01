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
  gelinktNotuleren: reads('mandataris.generatedFromGelinktNotuleren'),
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
