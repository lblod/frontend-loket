import Component from '@ember/component';
import { computed } from '@ember/object';

const aggregate = function(aggregations, obs) {
  return aggregations.reduce((acc, { groupBy, concept }) => {
    return acc && obs.get(`${groupBy}.uri`) == concept.get('uri');
  }, true);
};

export default Component.extend({
  tagName: '',

  total: computed('observations.@each.value', 'aggregations', function() {
    if (this.observations && this.aggregations) {
      return this.observations.filter(obs => aggregate(this.aggregations, obs)).reduce((acc, obs) => {
        return acc + parseFloat(obs.value || 0);
      }, 0);
    } else {
      return 0;
    }
  })
});
