import Component from '@ember/component';

export default Component.extend({
  showDetails: false,
  actions: {
    select(){
      this.onSelect(this.persoon);
    },
    toggleDetails(){
      this.set('showDetails', !this.showDetails);
    }
  }
});
