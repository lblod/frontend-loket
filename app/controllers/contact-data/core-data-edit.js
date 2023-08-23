import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class CoreDataEditController extends Controller {
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

  selectedAutomaticAddress = 'Kleine dorpstraat 99, 5000 Snuiteghem';

  automaticAddressOptions = ['Kleine dorpstraat 99, 5000 Snuiteghem'];

  automaticAddressSearchChanged(...args) {
    console.log('automaticAddressSearchChanged', args);
  }

  municipalityOptions = ['Kerkeghem'];
  selectedManualMunicipality = 'Kerkeghem';

  phoneNumberMaskOptions = {
    placeholder: '+32 400 10 20 30',
  };

  emailMaskOptions = {
    placeholder: 'naam.achternaam@provider.be',
  };

  websiteMaskOptions = {
    placeholder: 'naam.achternaam@provider.be',
  };
}
