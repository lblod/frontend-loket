import { warn } from '@ember/debug';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { observer } from '@ember/object';
import { isBlank } from '@ember/utils';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),
  dateFormat: 'DD-MM-YYYY',
  editOnlyMode: true, //some components will change behaviour when being in editMode
  createMode: false,
  viewMode: computed('editOnlyMode', 'createMode', function(){
    return !(this.get('editOnlyMode') || this.get('createMode'));
  }),
  saveError: false,
  hasFatalError: computed('saveError', 'requiredFieldError', function(){
    return this.get('saveError') || this.get('requiredFieldError');
  }),

  async didReceiveAttrs(){
    await this.initComponentProperties();
  },

  async initComponentProperties(){
    this.toggleCreateMode();
    this.set('destroyOnError', A());
    this.set('saveError', false);
    this.set('requiredFieldError', false);
    this.set('fractie', await this.get('mandataris.heeftLidmaatschap.binnenFractie'));
    this.set('beleidsdomeinen', (await this.get('mandataris.beleidsdomein')) || A());
    this.set('mandaat', await this.get('mandataris.bekleedt'));
    this.set('startDate', this.get('mandataris.start'));
    this.set('endDate', this.get('mandataris.einde'));
    this.set('rangorde', this.get('mandataris.rangorde.content'));
    this.set('status', await this.get('mandataris.status'));
  },

  toggleCreateMode(){
    if(!this.get('mandataris.id'))
      this.set('createMode', true);
  },

  save: task(function* (){
    this.set('saveError', false);
    this.set('requiredFieldError', false);
    try {
      yield this.saveNewBeleidsdomeinen();

      //fractie is a complex object, requires some special flow
      yield this.saveLidmaatschap();

      if(!this.get('mandaat')){
        this.set('requiredFieldError', true);
        return this.get('mandataris');
      }

      this.set('mandataris.bekleedt', this.get('mandaat'));
      this.get('mandataris.beleidsdomein').setObjects(this.get('beleidsdomeinen'));
      this.set('mandataris.start', this.get('startDate'));
      this.set('mandataris.einde', this.get('endDate'));

      if(this.get('rangorde'))
        this.set('mandataris.rangorde', {content: this.get('rangorde'), language: 'nl'});
      else
        this.set('mandataris.rangorde', undefined);

      this.set('mandataris.status', this.get('status'));

      return yield this.get('mandataris').save();
    }
    catch (e){
      this.set('saveError', true);
      warn(`error during save ${e}`, { id: 'save-error' });
      this.cleanUpOnError();
    }
  }),

  async saveNewBeleidsdomeinen(){
    let savingD = this.get('beleidsdomeinen').map(async d => {
      if(d.get('isNew')){
        await d.save();
        this.get('destroyOnError').pushObject(d);
      }
    });
    return Promise.all(savingD);
  },

  async saveLidmaatschap(){
    if(!this.get('mandataris.heeftLidmaatschap.id') && this.get('fractie')){
      await this.createNewLidmaatschap();
      return;
    }

    //if new and old fractie are both onahankelijk, nothing needs to be done...
    let currFractie = await this.get('mandataris.heeftLidmaatschap.binnenFractie');
    if(( await currFractie.get('fractietype.isOnafhankelijk') ) && this.get('fractie.fractietype.isOnafhankelijk')){
      return;
    }

    if((this.get('mandataris.heeftLidmaatschap.binnenFractie.id') !== this.get('fractie.id'))){
      await this.updateLidmaatschap();
      return;
    }
    if(!this.get('fractie'))
      return;
    this.set('mandataris.heeftLidmaatschap.tijdsinterval', await this.getTijdsinterval(this.get('mandataris.start'), this.get('mandataris.einde')));
  },

  async updateLidmaatschap(){
    let lidmaatschap = await this.get('mandataris.heeftLidmaatschap');
    let fractie = await lidmaatschap.get('binnenFractie');
    await lidmaatschap.destroyRecord();
    if(fractie.get('fractietype.isOnafhankelijk')){
      await fractie.destroyRecord();
    }
    await this.createNewLidmaatschap();
  },

  async createNewLidmaatschap(){
    let tijdsinterval = await this.getTijdsinterval(this.get('mandataris.start'), this.get('mandataris.einde'));
    let fractie = this.get('fractie');

    if(!fractie.get('id')){
      await fractie.save();
    }

    let lidmaatschap =  await this.get('store').createRecord('lidmaatschap', {
      binnenFractie: fractie, lidGedurende: tijdsinterval
    });
    await lidmaatschap.save();

    this.get('destroyOnError').pushObject(lidmaatschap);
    this.set('mandataris.heeftLidmaatschap', lidmaatschap);
  },

  validateStatus: observer('status', function(){
    this.set('statusError', null);
    if(!this.get('status') && !this.get('createMode'))
      this.set('statusError', 'Gelieve een status op te geven.');
  }),

  valideerStartEnEinde: observer('startDate', 'endDate', function() {
    const start = this.get('startDate');
    const end = this.get('endDate');
    this.set('startDateError', null);
    this.set('endDateError', null);
    if (isBlank(start))
      this.set('startDateError', 'geplande start is een vereist veld');
    if (start && end  && end < start ) {
      this.set('startDateError', 'geplande start moet voor gepland einde liggen');
      this.set('endDateError', 'gepland einde moet na geplande start liggen');
    }
  }),

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
    //TODO: better rollback of relations
    this.get('mandataris').rollbackAttributes();
    this.get('destroyOnError').forEach(o => {
        o.destroyRecord();
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
      this.set('beleidsdomeinen', beleidsdomeinen);
    },

    setStatusCode(status){
      this.set('status', status);
    },

    async save(){
      let mandataris = await this.save.perform();
      if(!this.get('hasFatalError')){
        this.set('editOnlyMode', false);
        this.set('createMode', false);
        this.get('onSave')(mandataris);
      }
    },

    cancel(){
      this.initComponentProperties();
      if(this.get('createMode'))
        this.get('onCancelCreate')(this.get('mandataris'));
      else
        this.set('editOnlyMode', false);
    },

    previous(){
      this.get('onPrevious')();
    },

    edit(){
      this.set('editOnlyMode', true);
    }
  }
});
