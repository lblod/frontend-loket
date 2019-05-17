import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({
  status: null,
  
  hasUnsavedData: computed('model.start', 'model.einde', 'status', function(){
    const startHasChanged = this.model.start !== undefined;
    const eindeHasChanged = this.model.einde !== undefined;
    const statusHasChanged = this.status && this.status !== this.defaultStatus;
    
    return startHasChanged || eindeHasChanged || statusHasChanged;
  }),

  async save() {
    await this.model.save();
  },

  reset() {
    this.set('status', null);
  },
  
  actions: {
    cancel(){
      this.transitionToRoute('leidinggevendenbeheer.functionarissen');
    },
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
      await this.model.save();
      const bestuursfunctieId = this.model.get('bekleedt.id');
      this.transitionToRoute('leidinggevendenbeheer.functionarissen', bestuursfunctieId, { queryParams: { page: 0 } });
    },
  }
});