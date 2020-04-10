import EmberPowerSelect from 'ember-power-select/components/power-select';

export default class MandatenbeheerPowerSelect extends EmberPowerSelect {
  constructor(props) {
    super(props);
    this.loadingMessage = 'Aan het laden...';
    this.noMatchesMessage = 'Geen resultaten';
    this.searchMessage = 'Typ om te zoeken';
  }
}
