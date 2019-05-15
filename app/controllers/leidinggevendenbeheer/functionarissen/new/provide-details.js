import Controller from '@ember/controller';
import { computed }  from '@ember/object';

export default Controller.extend({
  providedDataIsValid: computed('model.functionaris.start', 'model.functionaris.einde', function(){
    return this.model.functionaris.start && this.model.functionaris.einde && this.model.functionaris.datesAreCompatible;
  }),
  
  async clearModel() {
    this.model.functionaris.set('isBestuurlijkeAliasVan', null);
    this.model.functionaris.set('start', undefined);
    this.model.functionaris.set('einde', undefined);
    this.model.functionaris.set('status', this.model.defaultStatus);
  },

  actions: {
    cancel(){
      this.transitionToRoute('leidinggevendenbeheer.functionarissen');
    },
    gotoPreviousStep() {
      this.clearModel();
      this.transitionToRoute('leidinggevendenbeheer.functionarissen.new.select-persoon');
    },
    setStatus(statusId){
      if (statusId == this.model.aangesteldStatus.id)
        this.model.functionaris.set('status', this.model.aangesteldStatus);
      else if (statusId == this.model.waarnemendStatus.id)
        this.model.functionaris.set('status', this.model.waarnemendStatus);
    },
    async addPeriod() {
      await this.model.functionaris.save();
      this.transitionToRoute('leidinggevendenbeheer.functionarissen.index');
    },
  }
});