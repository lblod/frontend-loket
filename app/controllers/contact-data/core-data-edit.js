import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CoreDataEditController extends Controller {
  @service currentSession;
  selectedName = 'Naam';
  selectTypeBestuurOptions = ['Test 1', 'Test 2', 'Type bestuur'];
  selectedTypeBestuur = 'Type Bestuur';
  selectRegioOptions = ['Chocowakije', 'Carpetland'];
  selectedRegio = 'Chocowakije';
  selectStatusOptions = ['Actief'];
  selectedStatus = 'Actief';
  selectedKbo = '';
  kboMaskOptions = {
    mask: '9999.999.999',
    placeholder: '0000.000.000',
  };
  selectedNis = '';
  seletedOvo = '';

  @action
  handleContactDataForm(contactDataResult) {
    console.log(contactDataResult);
  }
}
