import Component from '@ember/component';
import { computed }  from '@ember/object';

export default Component.extend({
  address: null,
  onChange: null,

  placeholder: computed('disabled', function() {
    return this.disabled ? 'Geen busnummer beschikbaar bij dit adres.' : '';
  })
});
