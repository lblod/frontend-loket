import Route from '@ember/routing/route';

export default Route.extend({
  async model(){
    let status = (await this.get('store').findAll('document-status')).find(s => s.isConcept);
    return this.get('store').createRecord('bbcdr-report', {status});
  }
});
