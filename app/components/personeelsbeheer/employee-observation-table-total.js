import Component from '@glimmer/component';

const aggregate = function (aggregations, obs) {
  return aggregations.reduce((acc, { groupBy, concept }) => {
    return acc && obs.get(`${groupBy}.uri`) == concept.get('uri');
  }, true);
};
export default class EmployeeObservationTableTotal extends Component {
  get total() {
    const isFloat = this.args.observations.firstObject.unitMeasure.get('isFTE');
    if (this.args.observations && this.args.aggregations) {
      const observedValue = this.args.observations
        .filter((obs) => aggregate(this.args.aggregations, obs))
        .reduce((acc, obs) => {
          return acc + parseFloat(obs.value || 0);
        }, 0);
      if (isFloat) return observedValue.toFixed(2);
      else return parseInt(observedValue);
    } else {
      return 0;
    }
  }
}
