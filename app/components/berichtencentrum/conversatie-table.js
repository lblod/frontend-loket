import Component from '@ember/component';

export default Component.extend({
  init(){
    this._super(...arguments);
    this.set('bigHeaders',
             [{label:'Betreft',field:'betreft'},
              {label:'Type communicatie',field:'typeCommunicatie'},
              {label:'Dossier-nummer',field:'dossiernummer'},
              {label:'Reactietermijn',field:'reactietermijn'},
              {label:'Laatste bericht',field:'laatste-bericht.verzonden'},
              {label:'Laatste bericht verstuurd door',field:'laatste-bericht.van.naam'}]);
    this.set('smallHeaders',
             [{label:'Betreft',field:'betreft'},
              {label:'Type communicatie',field:'typeCommunicatie'},
              {label:'Dossier-nummer',field:'dossiernummer'}]);
  }
});
