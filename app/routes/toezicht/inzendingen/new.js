import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),
  async model(){
    let bestuurseenheid = await this.get('currentSession.group');
    let status =  (await this.store.query('document-status', {
      filter: { ':uri:': 'http://data.lblod.info/document-statuses/concept' }
    })).firstObject;
    let formNode = await this.get('store').findRecord('form-node', '8a0eae1a867ace6641db65eb1f7d9d4a22927eb614dcf210550d66d801f4481e');
    let inzendingVoorToezicht = this.get('store').createRecord('inzendingVoorToezicht', {status, bestuurseenheid, created: new Date()});

    return this.get('store').createRecord('formSolution', {formNode, inzendingVoorToezicht});
  }
});
