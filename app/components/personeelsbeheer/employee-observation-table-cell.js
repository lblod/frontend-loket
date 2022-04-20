/* eslint-disable ember/no-classic-components, ember/no-classic-classes, ember/no-component-lifecycle-hooks, ember/no-actions-hash */
import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { conditional, raw } from 'ember-awesome-macros';

export default Component.extend({
  tagName: '',

  isFloat: reads('observation.unitMeasure.isFTE'),
  step: conditional('isFloat', raw(0.01), raw(1)),

  didReceiveAttrs() {
    this._super(...arguments);
    if (
      this.observations &&
      this.unitMeasure &&
      this.educationalLevel &&
      this.workingTimeCategory &&
      this.legalStatus &&
      this.sex
    ) {
      const observation = this.observations.find(
        (obs) =>
          obs.unitMeasure.get('uri') == this.unitMeasure.get('uri') &&
          obs.educationalLevel.get('uri') == this.educationalLevel.get('uri') &&
          obs.workingTimeCategory.get('uri') ==
            this.workingTimeCategory.get('uri') &&
          obs.legalStatus.get('uri') == this.legalStatus.get('uri') &&
          obs.sex.get('uri') == this.sex.get('uri')
      );
      this.set('observation', observation);
    }
  },

  actions: {
    setValue(value) {
      if (value < 0 || value === '') value = 0;

      if (this.isFloat) {
        const float = Number.parseFloat(value).toFixed(2);
        this.observation.set('value', float);
      } else {
        const int = Math.ceil(value);
        this.observation.set('value', int);
      }
      this.onChange(this.observation);
    },
  },
});
