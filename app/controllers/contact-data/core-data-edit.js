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

  selectProvincieOptions = ['West-Vlaanderen'];
  selectedAutomaticProvincie = 'West-Vlaanderen';

  kboMaskOptions = {
    mask: '9999.999.999',
    placeholder: '0000.000.000',
  };
  postcodeMaskOptions = {
    mask: '9999',
    placeholder: '0000',
  };
  /** @type {'automatic' | 'manual'} */
  addressInputMode = 'automatic';

  selectedAutomaticAddress = 'Grote Markt 3, 9300 Aalst';

  automaticAddressOptions = ['Kleine dorpstraat 99, 5000 Snuiteghem'];

  automaticAddressSearchChanged(...args) {
    console.log('automaticAddressSearchChanged', args);
  }

  municipalityOptions = ['Kerkeghem'];
  selectedManualMunicipality = 'Kerkeghem';
}
