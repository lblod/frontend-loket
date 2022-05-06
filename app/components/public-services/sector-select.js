import Component from '@glimmer/component';
import { sectors } from 'frontend-loket/mock-data/public-services';

export default class SectorSelect extends Component {
  // TODO: Retrieve the correct data from the backend
  sectors = sectors;
}
