import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CoreDataOverviewController extends Controller {
  @service currentSession;

  selectTypeBestuurOptions = ['Test 1', 'Test 2'];
  selectedTypeBestuur = 'Test 1';

  selectRegioOptions = ['Chocowakije', 'Carpetland'];
  selectedRegio = 'Chocowakije';

  selectStatusOptions = ['Actief'];
  selectedStatus = 'Actief';

  kboMaskOptions = {
    mask: '9999.999.999',
    placeholder: '0000.000.000',
  };
}
