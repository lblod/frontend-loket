import { get } from '@ember/object';
import Component from '@ember/component';
import { computed } from '@ember/object';

const aggregate = function (aggregations, obs) {
  return aggregations.reduce((acc, { groupBy, concept }) => {
    return acc && obs.get(`${groupBy}.uri`) == concept.get('uri');
  }, true);
};

export default Component.extend({
  tagName: '',

  total: computed('observations.@each.value', 'aggregations', function () {
    const isFloat = get(this, 'observations.firstObject.unitMeasure.isFTE');
    if (this.observations && this.aggregations) {
      const observedValue = this.observations
        .filter((obs) => aggregate(this.aggregations, obs))
        .reduce((acc, obs) => {
          return acc + parseFloat(obs.value || 0);
        }, 0);
      if (isFloat) return observedValue.toFixed(2);
      else return parseInt(observedValue);
    } else {
      return 0;
    }
  }),
});
