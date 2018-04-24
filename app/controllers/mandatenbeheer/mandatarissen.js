import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';

export default Controller.extend({
  sort: 'is-bestuurlijke-alias-van.achternaam',
  page: 0,
  size: 20,
  activeChildRoute: '',
  addMandatarisRoute: 'mandatenbeheer.mandatarissen.new',
  isDisplayingAddMandataris: computed('activeChildRoute', function(){
    return this.get('activeChildRoute') === this.get('addMandatarisRoute');
  }),

  search: task(function* (searchData) {
   yield timeout(300);
   yield this.set('filter', searchData);
  }).restartable(),

  actions: {
    handleAddMandatarisClick(){
      if(!this.get('isDisplayingAddMandataris')){
        this.set('activeChildRoute', this.get('addMandatarisRoute'));
        return this.transitionToRoute(this.get('addMandatarisRoute'));
      }
      this.set('activeChildRoute', '');
      return this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
