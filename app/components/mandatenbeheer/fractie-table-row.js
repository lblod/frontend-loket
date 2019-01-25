import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  tagName: 'tr',
  isEditing: false,
  isAdding: false,
  tempValue: '',
  onEditFinish: null,
  nameBeforeEdit: '',

  init() {
    this._super(...arguments);
  },

  isNotValid: computed(function(){
    if (this.isAdding)
      return this.tempValue == ''
    else if(this.isEditing)
      return this.nameBeforeEdit == this.fractie.naam || this.fractie.naam == ''
  }),

  bestuursorganenInTijdStart: reads('fractie.bestuursorganenInTijd.firstObject.bindingStart'),
  bestuursorganenInTijdEinde: reads('fractie.bestuursorganenInTijd.firstObject.bindingEinde'),

  didReceiveAttrs() {
    this._super(...arguments);
    this.hasFractieLidmaatschap.perform();
  },

  hasFractieLidmaatschap: task(function* () {
    const fractie = yield this.fractie;
    const lidmaatschap = yield this.store.query('lidmaatschap', {'filter[lidmaatschap][binnenFractie]': fractie});
    // return lidmaatschap;
  }).drop(),

  actions: {
    startFractieEdit() {
      this.set("nameBeforeEdit", this.fractie.naam);
      this.openEditSession();
    },
    cancelFractieEdit() {
      if (this.isAdding) {
        this.onEditFinish('');
      } else {
        this.set("fractie.naam", this.nameBeforeEdit);
      }
      this.closeEditSession();
    },
    approveFractieEdit() {
      //-- make a new fractie or update the existing one
      try {
        let param = null;
        if (this.isAdding) {
          param = this.tempValue
        } else {
          param = this.fractie
        }
        this.onEditFinish(param);
      } catch (err) {
        this.onEditFinish(this.fractie);
      }


      //-- finalize the session
      this.closeEditSession();
    },
  },

  openEditSession() {
    this.set("isEditing", true);
  },
  closeEditSession() {
    //-- restore defaults
    this.set('nameBeforeEdittempValue', '');
    this.set('tempValue', '');

    //-- close the session
    this.set("isAdding", false);
    this.set("isEditing", false);
  }
});
