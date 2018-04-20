import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';
import moment from 'moment';

export default Component.extend({
  store: service(),
  dateFormat: 'DD.MM.YYYY',

  startDate: computed('rawStartDate', function(){
    return moment(this.get('rawStartDate'), this.get('dateFormat'));
  }),

  endDate: computed('rawEndDate', function(){
    return moment(this.get('rawEndDate'), this.get('dateFormat'));
  }),

  disableSave: computed('mandaat', 'rawStartDate', function(){
    return !(this.get('mandaat') && this.get('rawStartDate'));
  }),

  save: task(function* (){
    yield this.createNewBeleidsdomeinen();

    let lidmaatschap;

    if(this.get('fractie')){
      lidmaatschap = yield this.createLidmaatschap();
    }

    let mandataris = yield this.get('store').createRecord('mandataris', {
      start: this.get('startDate'),
      einde: this.get('eindeDate'),
      bekleedt: this.get('mandaat'),
      heeftLidmaatschap: lidmaatschap,
      isBestuurlijkeAliasVan: this.get('persoon'),
      beleidsdomein: this.get('beleidsdomeinen')
    });

    return mandataris.save();
  }),

  async createNewBeleidsdomeinen(){
    if(!this.get('beleidsdomeinen')){
      this.set('beleidsdomeinen', A());
      return;
    }

    //TODO: should we cleanup on fail?
    let savingD = this.get('beleidsdomeinen').map(d => {
      if(d.get('isNew'))
         return d.save();
    });

    return Promise.all(savingD);
  },

  async createLidmaatschap(){
    let fractie = this.get('fractie');
    let tijdsinterval = await this.get('store').createRecord('tijdsinterval', {
      begin: this.get('startDate'), einde: this.get('eindeDate')
    });
    await tijdsinterval.save();

    try{
      let lidmaatschap =  await this.get('store').createRecord('lidmaatschap', {
        binnenFractie: fractie, lidGedurende: tijdsinterval
      });
      await lidmaatschap.save();
      return lidmaatschap;
    }
    catch (error){
      await tijdsinterval.delete();
      throw error;
    }
  },

  actions: {
    async setPersoon(persoon){
      this.set('persoon', persoon);
    },

    setFractie(fractie){
      this.set('fractie', fractie);
    },

    setMandaat(mandaat){
      this.set('mandaat', mandaat);
    },

    setBeleidsdomeinen(beleidsdomeinen){
      this.set('beleidsdomeinen', beleidsdomeinen);
    },

    async save(){
      let mandataris = await this.save.perform();
      this.get('onSave')(mandataris);
    },

    cancel(){
      this.get('onCancel')();
    }
  }
});
