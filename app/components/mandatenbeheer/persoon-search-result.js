import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerPersoonSearchResultComponent extends Component {
  @tracked showDetails = false;

  @action
    select(){
      this.args.onSelect(this.args.persoon);
    }

  @action
    toggleDetails(){
      this.showDetails = !this.showDetails;
    }
  }
