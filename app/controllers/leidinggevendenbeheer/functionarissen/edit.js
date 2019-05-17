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
  
  async init() {
    this._super(...arguments);
    this.set('aangesteldStatus', (await this.store.query('functionaris-status-code', {
      filter: { ':uri:': 'http://data.vlaanderen.be/id/concept/functionarisStatusCode/45b4b155-d22a-4eaf-be3a-97022c6b7fcd' }})).firstObject);

    this.set('waarnemendStatus', (await this.store.query('functionaris-status-code', {
    filter: { ':uri:': 'http://data.vlaanderen.be/id/concept/functionarisStatusCode/188fc9c0-dae7-43b2-b2b3-6122c1594479' }})).firstObject);
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
    cancel(){
      const f = this.model.functionaris;
      const statusHasChanged = f.status !== this.model.initialStatus;
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
      if (statusId == this.aangesteldStatus.id)
        this.model.functionaris.set('status', this.aangesteldStatus);
      else if (statusId == this.waarnemendStatus.id)
        this.model.functionaris.set('status', this.waarnemendStatus);
    }
  }
});