import Component from '@ember/component';

export default Component.extend({
  showDetails: false,
  actions: {
    select(){
      this.get('onSelect')(this.get('persoon'));
    },
    toggleDetails(){
      this.set('showDetails', !this.get('showDetails'));
    }
  }
});
