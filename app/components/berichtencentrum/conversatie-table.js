import Component from '@ember/component';

export default Component.extend({
  init(){
    this._super(...arguments);
    this.set('bigHeaders',
             [{label:'betreft',field:'betreft'},
              {label:'Type communicatie',field:'typeCommunicatie'},
              {label:'Dossier-nummer',field:'dossiernummer'},
              {label:'Reactietermijn',field:'reactietermijn'},
              {label:'Laatste bericht',field:'laatsteBericht.verzonden'},
              {label:'Laatste bericht verstuurd door',field:'laatsteBericht.van.naam'}]);
    this.set('smallHeaders',
             [{label:'betreft',field:'betreft'},
              {label:'Type communicatie',field:'typeCommunicatie'},
              {label:'Dossier-nummer',field:'dossiernummer'}]);
  }
});
