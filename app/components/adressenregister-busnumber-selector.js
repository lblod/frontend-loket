import Component from '@ember/component';

export default class AdressenregisterBusnumberSelectorComponent extends Component {
  get placeholder() {
    return this.disabled ? 'Geen busnummer beschikbaar bij dit adres.' : '';
  }
}
