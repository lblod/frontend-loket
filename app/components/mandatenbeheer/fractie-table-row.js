import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  tagName: 'tr',
  editMode: false,
  canRemove: false,

  isValid: computed('fractie', 'fractie.naam', function() {
    return this.fractie && this.fractie.naam && this.fractie.hasDirtyAttributes;
  }),

  bestuursperiodeStart: reads('fractie.bestuursorganenInTijd.firstObject.bindingStart'),
  bestuursperiodeEnd: reads('fractie.bestuursorganenInTijd.firstObject.bindingEinde'),

  didReceiveAttrs() {
    this._super(...arguments);
    this.setFractieHasLidmaatschap.perform();
  },

  setFractieHasLidmaatschap: task(function* () {
    const lidmaatschap = yield this.store.query('lidmaatschap', {
      'filter[binnen-fractie][:id:]': this.fractie.id
    });
    this.set('canRemove', lidmaatschap.length == 0);
  }).drop(),

  actions: {
    cancel() {
      this.set('editMode', false);
      this.onCancel(this.fractie);
      this.fractie.rollbackAttributes();
    },
    save() {
      this.set('editMode', false);
      this.onSave(this.fractie);
    },
    async remove() {
      await this.fractie.destroyRecord();
    }
  }
});
