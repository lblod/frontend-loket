import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({
  //--- variables
  dataIsGettingLost: false,

  canConfirm: computed('model.functionaris.start', 'model.functionaris.einde', function(){
    return this.model.functionaris.start && this.model.functionaris.einde && this.model.functionaris.datesAreCompatible;
  }),

  //--- methods
  exit() {
    this.set('dataIsGettingLost', false);
    this.transitionToRoute('leidinggevendenbeheer.functionarissen');
  },
  
  //--- actions
  actions: {
    annuleer(){
      this.set('dataIsGettingLost', false);
    },
    async bewaar(){
      await this.model.functionaris.save();
      this.set('dataIsGettingLost', false);
      this.transitionToRoute('leidinggevendenbeheer.functionarissen');
    },
    async cancel(){
      const f = this.model.functionaris;
      const statusHasChanged = (await f.status) !== this.model.initialStatus;
      if (!f.hasDirtyAttributes && !statusHasChanged) {
        this.exit();
      } else {
        //--- This will reveal the modal confirmation dialog
        this.set('dataIsGettingLost', true);
      }
    },
    async confirmChanges() {
      await this.model.functionaris.save();
      this.transitionToRoute('leidinggevendenbeheer.functionarissen');
    },
    dismissChanges() {
      this.model.functionaris.rollbackAttributes();
      this.model.functionaris.set('status', this.model.initialStatus),
      this.exit();
    },
    setStatus(statusId){
      if (statusId == this.model.aangesteldStatus.id)
        this.model.functionaris.set('status', this.model.aangesteldStatus);
      else if (statusId == this.model.waarnemendStatus.id)
        this.model.functionaris.set('status', this.model.waarnemendStatus);
    }
  }
});