import Component from '@glimmer/component';
import { action } from '@ember/object';

// TODO : Fix the NaN warning when unfocus on empty cells

export default class EmployeeObservationTableCell extends Component {
  tagName = '';

  isFloat;
  handleOnChange;

  constructor() {
    super(...arguments);
    const {
      observations,
      unitMeasure,
      educationalLevel,
      workingTimeCategory,
      legalStatus,
      sex,
      onChange,
    } = this.args;

    this.handleOnChange = onChange;

    if (
      observations &&
      unitMeasure &&
      educationalLevel &&
      workingTimeCategory &&
      legalStatus &&
      sex
    ) {
      const observation = observations.find(
        (obs) =>
          obs.unitMeasure.get('uri') == unitMeasure.get('uri') &&
          obs.educationalLevel.get('uri') == educationalLevel.get('uri') &&
          obs.workingTimeCategory.get('uri') ==
            workingTimeCategory.get('uri') &&
          obs.legalStatus.get('uri') == legalStatus.get('uri') &&
          obs.sex.get('uri') == sex.get('uri')
      );
      this.observation = observation;
    }
    this.isFloat = this.observation.unitMeasure.get('isFTE');
  }

  get step() {
    return this.isFloat ? 0.01 : 1;
  }

  saveChange(change) {
    this.handleOnChange(change);
  }

  @action
  setValue(value) {
    if (value < 0 || value === '') value = 0;

    if (this.isFloat) {
      const float = Number.parseFloat(value).toFixed(2);
      this.observation.value = float;
    } else {
      const int = Math.ceil(value);
      this.observation.value = int;
    }
    this.saveChange(this.observation);
  }
}
