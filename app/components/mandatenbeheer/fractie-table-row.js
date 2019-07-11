import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  tagName: 'tr',
  editMode: false,

  isValid: computed('fractie', 'fractie.naam', function() {
    return this.fractie && this.fractie.naam && this.fractie.hasDirtyAttributes;
  }),

  bestuursperiodeStart: reads('fractie.bestuursorganenInTijd.firstObject.bindingStart'),
  bestuursperiodeEnd: reads('fractie.bestuursorganenInTijd.firstObject.bindingEinde'),

  actions: {
    cancel() {
      this.set('editMode', false);
      this.onCancel(this.fractie);
      this.fractie.rollbackAttributes();
    },
    save() {
      this.set('editMode', false);
      this.onSave(this.fractie);
    }
  }
});
