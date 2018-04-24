import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';

export default Component.extend({
  store: service(),
  dateFormat: 'DD-MM-YYYY',
  editOnlyMode: false, //some components will change behaviour when being in editMode
  saveError: false,

  init(){
    this._super(...arguments);
    this.set('destroyOnError', A());
  },

  didReceiveAttrs(){
    this.set('fractie', this.get('mandataris.heeftLidmaatschap.binnenFractie'));
  },

  mandaat: computed('mandataris.bekleedt', {
    set(key, value){
        this.set('mandataris.bekleedt', value);
    },
    get(){
        return this.get('mandataris.bekleedt');
      }
    }),

  beleidsdomein: computed('mandataris.beleidsdomein', {
    set(key, value){
      if(value.length === 1)
        return this.get('mandataris').get(key).pushObject(value);
      return this.get('mandataris').get(key).setObjects(value);
    },
    get(){
      return this.get('mandataris.beleidsdomein');
    }
  }),

  startDate: alias('mandataris.start'),

  endDate: alias('mandataris.einde'),

  save: task(function* (){
    try {
      yield this.saveNewBeleidsdomeinen();
      //fractie is a complex object, requires some special flow
      yield this.saveLidmaatschap();
      return this.get('mandataris').save();
    }
    catch (e){
      //TODO: needs refinment later
      this.set('saveError', true);
      console.log(`error during save ${e}`);
      this.cleanUpOnError();
    }
  }),

  async saveNewBeleidsdomeinen(){
    let savingD = this.get('mandataris.beleidsdomein').map(async d => {
      if(d.get('isNew')){
        await d.save();
        this.get('destroyOnError').pushObject(d);
      }
    });
    return Promise.all(savingD);
  },

  async saveLidmaatschap(){
    if(!this.get('mandataris.heeftLidmaatschap.id')){
      await this.createNewLidmaatschap();
      return;
    }
    if(this.get('mandataris.heeftLidmaatschap.binnenFractie.id') !== this.get('fractie.id')){
      await this.updateLidmaatschap();
      return;
    }
    this.set('mandataris.heeftLidmaatschap.tijdsinterval', await this.getTijdsinterval(this.get('mandataris.start'), this.get('mandataris.einde')));
  },

  async updateLidmaatschap(){
    let lidmaatschap = await this.get('mandataris.heeftLidmaatschap');
    await lidmaatschap.destroyRecord();
    await this.createNewLidmaatschap();
  },

  async createNewLidmaatschap(){
    let tijdsinterval = await this.getTijdsinterval(this.get('mandataris.start'), this.get('mandataris.einde'));
    let fractie = this.get('fractie');

    let lidmaatschap =  await this.get('store').createRecord('lidmaatschap', {
      binnenFractie: fractie, lidGedurende: tijdsinterval
    });
    await lidmaatschap.save();

    this.get('destroyOnError').pushObject(lidmaatschap);
    this.set('mandataris.heeftLidmaatschap', lidmaatschap);
  },

  async getTijdsinterval(begin, einde){
    let tijdsinterval = await this.findTijdsinterval(begin, einde);
    if(!tijdsinterval){
      tijdsinterval = this.get('store').createRecord('tijdsinterval', {begin, einde});
      await tijdsinterval.save();
      this.get('destroyOnError').pushObject(tijdsinterval);
    }
    return tijdsinterval;
  },

  async findTijdsinterval(startDate, endDate){
    let begin = startDate ? startDate.toISOString().substring(0, 10) : '';
    let einde = endDate ? endDate.toISOString().substring(0, 10) : '';
    return await this.get('store').query('tijdsinterval',{filter: {begin, einde}});
  },

  async cleanUpOnError(){
    this.get('destroyOnError').forEach(o => {
      try {
        o.destroyRecord();
      }
      catch (e){
        console.log('error during cleanup');
        console.log(e);
      }
    });
  },

  actions: {
    setFractie(fractie){
      this.set('fractie', fractie);
    },

    setMandaat(mandaat){
      this.set('mandaat', mandaat);
    },
    setBeleidsdomein(beleidsdomeinen){
      this.set('beleidsdomein', beleidsdomeinen);
    },

    async save(){
      let mandataris = await this.save.perform();
      if(!this.get('saveError'))
        this.get('onSave')(mandataris);
    },

    cancel(){
      this.get('onCancel')();
    }
  }
});
