import { warn } from '@ember/debug';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { observer } from '@ember/object';
import { isBlank } from '@ember/utils';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Component.extend({
  tag: 'li',
  classNames: ['au-c-list-vertical__item'],
  store: service(),
  dateFormat: 'DD-MM-YYYY',
  editMode: false, //some components will change behaviour when being in editMode
  correctMode: false,
  terminateMode: false,
  createMode: false,
  promptMode: false,
  viewMode: computed('editOnlyMode', 'createMode', function () {
    return !(this.editOnlyMode || this.createMode);
  }),
  saveError: false,
  hasFatalError: computed('saveError', 'requiredFieldError', function () {
    return this.saveError || this.requiredFieldError;
  }),

  async didReceiveAttrs() {
    await this.initComponentProperties();
  },

  async initComponentProperties() {
    this.toggleCreateMode();
    this.set('destroyOnError', A());
    this.set('saveError', false);
    this.set('requiredFieldError', false);
    this.set(
      'fractie',
      await this.get('mandataris.heeftLidmaatschap.binnenFractie')
    );
    this.set(
      'beleidsdomeinen',
      ((await this.get('mandataris.beleidsdomein')) || A()).toArray()
    );
    this.set('mandaat', await this.get('mandataris.bekleedt'));
    this.set('startDate', this.get('mandataris.start'));
    this.set('endDate', this.get('mandataris.einde'));
    this.set('rangorde', this.get('mandataris.rangorde.content'));
    this.set('status', await this.get('mandataris.status'));
  },

  toggleCreateMode() {
    if (!this.get('mandataris.id')) this.set('createMode', true);
  },

  save: task(function* () {
    this.set('saveError', false);
    this.set('requiredFieldError', false);
    try {
      yield this.saveNewBeleidsdomeinen();

      //fractie is a complex object, requires some special flow
      yield this.saveLidmaatschap();

      if (!this.mandaat) {
        this.set('requiredFieldError', 'Gelieve een mandaat op te geven.');
        return;
      }

      if (!this.status) {
        this.set('requiredFieldError', 'Gelieve een status op te geven.');
        return;
      }

      this.set('mandataris.bekleedt', this.mandaat);
      this.get('mandataris.beleidsdomein').setObjects(this.beleidsdomeinen);
      this.set('mandataris.start', this.startDate);
      this.set('mandataris.einde', this.endDate);

      if (this.rangorde)
        this.set('mandataris.rangorde', {
          content: this.rangorde,
          language: 'nl',
        });
      else this.set('mandataris.rangorde', undefined);

      this.set('mandataris.status', this.status);

      return yield this.mandataris.save();
    } catch (e) {
      this.set('saveError', true);
      warn(`error during save ${e}`, { id: 'save-error' });
      this.cleanUpOnError();
    }
  }),

  async saveNewBeleidsdomeinen() {
    let savingD = this.beleidsdomeinen.map(async (d) => {
      if (d.get('isNew')) {
        await d.save();
        this.destroyOnError.pushObject(d);
      }
    });
    return Promise.all(savingD);
  },

  async saveLidmaatschap() {
    if (!this.get('mandataris.heeftLidmaatschap.id')) {
      if (this.fractie) {
        await this.createNewLidmaatschap();
        return;
      } else {
        // old and new fraction are both undefined. Nothing needs to be done...
        return;
      }
    }

    // if new and old fractie are both onafhankelijk, nothing needs to be done...
    let currFractie = await this.get(
      'mandataris.heeftLidmaatschap.binnenFractie'
    );
    if (
      currFractie &&
      (await currFractie.get('fractietype.isOnafhankelijk')) &&
      this.get('fractie.fractietype.isOnafhankelijk')
    ) {
      return;
    }

    if (
      this.get('mandataris.heeftLidmaatschap.binnenFractie.id') !==
      this.get('fractie.id')
    ) {
      await this.updateLidmaatschap();
      return;
    }
    if (!this.fractie) return;
    this.set(
      'mandataris.heeftLidmaatschap.tijdsinterval',
      await this.getTijdsinterval(
        this.get('mandataris.start'),
        this.get('mandataris.einde')
      )
    );
  },

  async updateLidmaatschap() {
    let lidmaatschap = await this.get('mandataris.heeftLidmaatschap');
    let fractie = await lidmaatschap.get('binnenFractie');
    await lidmaatschap.destroyRecord();
    if (fractie.get('fractietype.isOnafhankelijk')) {
      await fractie.destroyRecord();
    }
    if (this.fractie) {
      await this.createNewLidmaatschap();
    }
  },

  async createNewLidmaatschap() {
    let tijdsinterval = await this.getTijdsinterval(
      this.get('mandataris.start'),
      this.get('mandataris.einde')
    );
    let fractie = this.fractie;

    if (!fractie.get('id')) {
      await fractie.save();
    }

    let lidmaatschap = await this.store.createRecord('lidmaatschap', {
      binnenFractie: fractie,
      lidGedurende: tijdsinterval,
    });
    await lidmaatschap.save();

    this.destroyOnError.pushObject(lidmaatschap);
    this.set('mandataris.heeftLidmaatschap', lidmaatschap);
  },

  valideerStartEnEinde: observer('startDate', 'endDate', function () {
    const start = this.startDate;
    const end = this.endDate;
    this.set('startDateError', null);
    this.set('endDateError', null);
    if (isBlank(start))
      this.set('startDateError', 'geplande start is een vereist veld');
    if (start && end && end < start) {
      this.set(
        'startDateError',
        'geplande start moet voor gepland einde liggen'
      );
      this.set('endDateError', 'gepland einde moet na geplande start liggen');
    }
  }),

  async getTijdsinterval(begin, einde) {
    let tijdsinterval = await this.findTijdsinterval(begin, einde);
    if (!tijdsinterval) {
      tijdsinterval = this.store.createRecord('tijdsinterval', {
        begin,
        einde,
      });
      await tijdsinterval.save();
      this.destroyOnError.pushObject(tijdsinterval);
    }
    return tijdsinterval;
  },

  async findTijdsinterval(startDate, endDate) {
    let begin = startDate ? startDate.toISOString().substring(0, 10) : '';
    let einde = endDate ? endDate.toISOString().substring(0, 10) : '';
    return await this.store.query('tijdsinterval', {
      filter: { begin, einde },
    });
  },

  async cleanUpOnError() {
    //TODO: better rollback of relations
    this.mandataris.rollbackAttributes();
    this.destroyOnError.forEach((o) => {
      o.destroyRecord();
    });
  },

  actions: {
    /**  Temporary fix until we start using new datepicker. */
    preventPageRefresh(e) {
      e.preventDefault();
    },

    setFractie(fractie) {
      this.set('fractie', fractie);
    },

    setMandaat(mandaat) {
      this.set('mandaat', mandaat);
    },

    setBeleidsdomein(beleidsdomeinen) {
      this.set('beleidsdomeinen', beleidsdomeinen);
    },

    setStatusCode(status) {
      this.set('status', status);
    },

    handleDateChange(propName, isoDate, date) {
      this.set(propName, date);
    },

    async save() {
      let mandataris = await this.save.perform();
      if (!this.hasFatalError) {
        this.set('createMode', false);
        this.set('promptMode', false);
        this.set('editMode', false);
        this.set('terminateMode', false);
        this.set('correctMode', false);
        this.onSave(mandataris);
      }
    },

    cancel() {
      this.initComponentProperties();
      if (this.createMode) {
        this.set('createMode', false);
        this.onCancelCreate(this.mandataris);
      } else {
        this.set('promptMode', false);
        this.set('editMode', false);
        this.set('terminateMode', false);
        this.set('correctMode', false);
      }
    },

    previous() {
      this.onPrevious();
    },

    edit() {
      this.set('editMode', false);
      this.set('promptMode', true);
    },
    correct() {
      this.set('promptMode', false);
      this.set('editMode', true);
      this.set('correctMode', !this.correctMode);
    },
    terminate() {
      this.set('promptMode', false);
      this.set('editMode', true);
      this.set('terminateMode', !this.terminateMode);
    },
  },
});
