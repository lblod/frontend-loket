import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({
  status: null,
  userHasRequestedToClose: false,
  hasErrors: false,

  checkHasErrors: function(){
    this.set('hasErrors', false);
    if(!this.model.start){
      this.set('hasErrors', true);
      return true;
    }
    return false;
  },

  hasUnsavedData: computed('model.start', 'model.einde', 'status', function(){
    const startHasChanged = this.model.start !== undefined;
    const eindeHasChanged = this.model.einde !== undefined;
    const statusHasChanged = this.status && this.status !== this.defaultStatus;

    return startHasChanged || eindeHasChanged || statusHasChanged;
  }),

  dataIsGettingLost: computed('hasUnsavedData', 'userHasRequestedToClose', function(){
    return this.hasUnsavedData && this.userHasRequestedToClose;
  }),

  async save() {
    await this.model.save();
  },

  reset() {
    this.set('status', null);
  },

  exit() {
    this.set('userHasRequestedToClose', false);
    this.transitionToRoute('leidinggevendenbeheer.functionarissen');
  },

  actions: {
    gotoPreviousStep() {
      this.transitionToRoute('leidinggevendenbeheer.functionarissen.new.select-persoon');
    },

    async setStatus(statusId){
      if (statusId == this.aangesteldStatus.id) {
        this.model.set('status', this.aangesteldStatus);
      } else if (statusId == this.waarnemendStatus.id) {
        this.model.set('status', this.waarnemendStatus);
      }
      await this.set('status', this.model.status);
    },

    async addPeriod() {
      if(this.checkHasErrors()) return;
      await this.model.save();
      const bestuursfunctieId = this.model.get('bekleedt.id');
      //This is a 'trick/hack' to send an event to refresh the model, which will bubble up.
      //Until a consumer acts on it
      this.send('reloadModelLeidinggevendenbeheerFunctionarissen');
      this.transitionToRoute('leidinggevendenbeheer.functionarissen', bestuursfunctieId, { queryParams: { page: 0 } });
    },

    annuleer(){
      this.set('userHasRequestedToClose', false);
    },

    async bewaar(){
      if(this.checkHasErrors()) return;
      await this.save();
      this.exit();
    },

    async cancel(){
      this.set('userHasRequestedToClose', true);
      if (! this.hasUnsavedData) {
        this.exit();
      }
    },

    async confirmChanges() {
      if(this.checkHasErrors()) return;
      await this.save();
      this.exit();
    },

    dismissChanges() {
      this.exit();
    }
  }
});
