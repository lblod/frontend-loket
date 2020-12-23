import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { alias } from '@ember/object/computed';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking'; 

export default class MandatenbeheerFractiesController extends Controller {
  @tracked newFractie = null;
  @tracked isBusy = false;
  @tracked defaultFractieType;

  @alias('mandatenbeheer.startDate') startDate;
  @alias('mandatenbeheer.bestuursperioden') bestuursperioden;
  @alias('mandatenbeheer.bestuurseenheid') bestuurseenheid;
  @alias('mandatenbeheer.bestuursorganen') bestuursorganen;

  @task(function * (fractie) {
    const isNew = fractie.isNew;
    yield fractie.save();

    if (isNew) {
      this.send('reloadModel');
      this.newFractie = null;
    }
  }) saveFractie;

  @action
    cancelEdit(fractie) {
      if (fractie.isNew)
        this.newFractie = null;
      fractie.rollbackAttributes(); // removes model from store if it's new
    }
  
  @action
    createNewFractie() {
      const fractie = this.store.createRecord('fractie', {
        fractietype: this.defaultFractieType,
        bestuursorganenInTijd: this.bestuursorganen,
        bestuurseenheid: this.bestuurseenheid
      });

      this.newFractie = fractie;
    }

  @action
    selectPeriod(startDate) {
      this.transitionToRoute('mandatenbeheer.fracties', {
        queryParams: {
          page: 0,
          startDate: startDate
        }
      });
    }
}
