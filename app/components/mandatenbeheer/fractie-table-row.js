import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
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

  actions: {
    startFractieEdit() {
      this.set("nameBeforeEdit", this.fractie.naam);
      this.openEditSession();
    },
    cancelFractieEdit() {
      if (!this.isAdding) this.set("fractie.naam", this.nameBeforeEdit);
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
