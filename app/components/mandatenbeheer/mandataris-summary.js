import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  rol: computed.reads('mandataris.bekleedt.bestuursfunctie.label'),
  start: computed.reads('mandataris.start'),
  einde: computed.reads('mandataris.einde'),
  fractie: computed.reads('mandataris.heeftLidmaatschap.binnenFractie.naam'),
  rangorde: computed.reads('mandataris.rangorde.content'),
  status: computed.reads('mandataris.status.label'),
  beleidsdomein: computed.reads('mandataris.beleidsdomein'),
  actions: {
    edit(){
      this.get('onEdit')();
    },
    terminate(){
      this.get('onTerminate')();
    },
    correct(){
      this.get('onCorrect')();
    }
  }
});
