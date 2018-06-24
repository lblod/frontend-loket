import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),
  async model(){
    let bestuurseenheid = await this.get('currentSession.group');
    let status =  (await this.store.query('document-status', {
      filter: { ':uri:': 'http://data.lblod.info/document-statuses/concept' }
    })).firstObject;

    let formNode = await this.get('store').findRecord('form-node', '0ecb1654df3d058cf6a636237179e038a8dd65f4edaa3efdfd4d3b7f8311d354');
    let inzendingVoorToezicht = this.get('store').createRecord('inzendingVoorToezicht', {status, bestuurseenheid, created: new Date()});

    return this.get('store').createRecord('formSolution', {formNode, inzendingVoorToezicht});
  }
});
