import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { computed } from '@ember/object';

export default Model.extend({
  filename: attr(),
  format: attr(),
  size: attr(),
  extension: attr(),
  created: attr('datetime'),
  sizeMb: computed('size', function() {
    return this.get('size') ? +(Math.round(this.get('size')/1000/1000 + "e+1") + "e-1") : 0;
  }),
  miniatureMetadata: computed('sizeMb', 'extension', function() {
    return `${this.extension} - ${this.sizeMb} MB`;
  })
});
