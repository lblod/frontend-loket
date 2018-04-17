import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  searchData: computed('persoonFilter', function(){
    return this.get('persoonFilter');
  }),

  search: task(function* (searchData) {
    yield timeout(300);
    yield this.set('persoonFilter', searchData);
  }).restartable()
});
