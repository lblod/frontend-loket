import EmberObject from '@ember/object';
import { sort } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  sorting: Object.freeze(['index']),
  sortedChildren: sort('model.children', 'sorting')
});
