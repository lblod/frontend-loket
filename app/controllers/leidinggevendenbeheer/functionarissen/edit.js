import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({

  dataIsGettingLost: false,

  exit() {
    this.transitionToRoute('leidinggevendenbeheer.functionarissen');
  },

  /**
   * This method will do the housekeeping
   * It will reset any any unneeded internal state of the controller
   */
  reset(){
    this.set('dataIsGettingLost', false);
  },

  actions: {
    async applyModifications() {
      await this.model.functionaris.save();
      this.exit();
    },
    
    async bewaar(){
      await this.model.functionaris.save();
      this.exit();
    },

    async gentleCancel(){
      const statusHasChanged = this.model.initialStatus != await this.model.functionaris.status;
      const someOtherDataHasChanged = this.model.functionaris.hasDirtyAttributes;
      this.set('dataIsGettingLost', statusHasChanged || someOtherDataHasChanged);
      if (! this.dataIsGettingLost)
        this.exit();
    },

    immediateCancel() {
      this.model.functionaris.rollbackAttributes();
      this.model.functionaris.set('status', this.model.initialStatus),
      this.exit();
    }
  }
});
