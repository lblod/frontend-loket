import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  actions: {
    setPersoon(persoon){
      this.set('persoon', persoon);
    },
    setFractie(fractie){
      this.set('fractie', fractie);
    },
    setMandaat(mandaat){
      this.set('mandaat', mandaat);
    }
  }
});
