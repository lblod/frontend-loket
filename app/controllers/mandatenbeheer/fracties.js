/* eslint-disable ember/no-computed-properties-in-native-classes */
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { alias } from '@ember/object/computed';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MandatenbeheerFractiesController extends Controller {
  @service router;
  @service store;

  @tracked newFractie = null;
  @tracked isBusy = false;
  @tracked defaultFractieType;
  @tracked mandatenbeheer;

  @alias('mandatenbeheer.bestuurseenheid') bestuurseenheid;
  @alias('mandatenbeheer.bestuursorganen') bestuursorganen;

  @task
  *saveFractie(fractie) {
    const isNew = fractie.isNew;
    yield fractie.save();

    if (isNew) {
      this.send('reloadModel');
      this.newFractie = null;
    }
  }

  @action
  cancelEdit(fractie) {
    if (fractie.isNew) this.newFractie = null;
    fractie.rollbackAttributes(); // removes model from store if it's new
  }

  @action
  createNewFractie() {
    const fractie = this.store.createRecord('fractie', {
      fractietype: this.defaultFractieType,
      bestuursorganenInTijd: this.bestuursorganen,
      bestuurseenheid: this.bestuurseenheid,
    });

    this.newFractie = fractie;
  }

  @action
  selectPeriod(period) {
    this.router.transitionTo('mandatenbeheer.fracties', {
      queryParams: {
        startDate: period.startDate,
        endDate: period.endDate,
        page: 0,
      },
    });
  }
}
