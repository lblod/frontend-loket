import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import moment from 'moment';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  newFractie: null,
  isBusy: false,

  startDate: alias('mandatenbeheer.startDate'),
  bestuursperioden: alias('mandatenbeheer.bestuursperioden'),
  bestuurseenheid: alias('mandatenbeheer.bestuurseenheid'),
  bestuursorganen: alias('mandatenbeheer.bestuursorganen'),

  saveFractie: task(function * (fractie) {
    const isNew = fractie.isNew;
    yield fractie.save();

    if (isNew) {
      this.send('reloadModel');
      this.set('newFractie', null);
    }
  }),

  actions: {
    cancelEdit(fractie) {
      if (fractie.isNew)
        this.set('newFractie', null);
      fractie.rollbackAttributes(); // removes model from store if it's new
    },
    createNewFractie() {
      const fractie = this.store.createRecord('fractie', {
        fractietype: this.defaultFractieType,
        bestuursorganenInTijd: this.bestuursorganen,
        bestuurseenheid: this.bestuurseenheid
      });

      this.set('newFractie', fractie);
    },
    selectPeriod(startDate) {
      this.transitionToRoute('mandatenbeheer.fracties', {
        queryParams: {
          page: 0,
          startDate: startDate
        }
      });
    }
  }
});
