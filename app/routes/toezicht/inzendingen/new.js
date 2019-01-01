import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),
  async model(){
    let bestuurseenheid = await this.get('currentSession.group');
    let status =  (await this.store.query('document-status', {
      filter: { ':uri:': 'http://data.lblod.info/document-statuses/concept' }
    })).firstObject;

    let inzendingVoorToezicht = this.store.createRecord('inzendingVoorToezicht', {status, bestuurseenheid, created: new Date()});

    return this.store.createRecord('formSolution', {inzendingVoorToezicht});
  }
});
