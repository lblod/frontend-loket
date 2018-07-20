import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  rol: computed.reads('mandataris.bekleedt.bestuursfunctie.label'),
  start: computed.reads('mandataris.start'),
  einde: computed.reads('mandataris.einde'),
  fractie: computed.reads('mandataris.heeftLidmaatschap.binnenFractie.naam'),
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
