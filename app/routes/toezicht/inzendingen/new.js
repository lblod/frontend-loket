import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),
  formVersionTracker: service('toezicht/form-version-tracker'),

  async model(){
    let bestuurseenheid = await this.get('currentSession.group');
    let status =  (await this.store.query('document-status', {
      filter: { ':uri:': 'http://data.lblod.info/document-statuses/concept' }
    })).firstObject;

    let inzendingVoorToezicht = this.store.createRecord('inzendingVoorToezicht', {status, bestuurseenheid, created: new Date()});

    //Only get latest form version.
    let formVersion = await this.store.findRecord('inzending-voor-toezicht-form-version', 'b925a87f-90dd-4f5a-8f14-c078ef2c3e3f');
    let formNode = await formVersion.get('formNode');
    this.formVersionTracker.updateFormVersion(formVersion); //tracker still required since behaviour components depend on it.

    return this.store.createRecord('formSolution', { inzendingVoorToezicht, formNode });
  }
});
