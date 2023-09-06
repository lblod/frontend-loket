import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

let mockSiteTypes = [
  {
    label: 'Hoofdgebouw erediensten',
    id: 'dd0418307e7038c0c3809e3ec03a0932',
  },

  {
    label: 'Maatschappelijke zetel',
    id: 'f1381723dec42c0b6ba6492e41d6f5dd',
  },

  {
    label: 'Gemeentehuis',
    id: '57e8e5498ca84056b8a87631a26c90af',
  },
  {
    label: 'Provinciehuis',
    id: '15f2683c61b74541b27b64b4365806c7',
  },

  {
    label: 'Districtshuis',
    id: 'db13a289b78e42d19d8d1d269b61b18f',
  },
  {
    label: 'Ander administratief adres',
    id: 'fbec5e94aba343b0a7361aca8a0c7d79',
  },
  {
    label: 'Andere vestiging',
    id: 'dcc01338-842c-4fbd-ba68-3ca6f3af975c',
  },
];

export default class SiteTypeSelectComponent extends Component {
  @service store;
  siteTypes;
  constructor(...args) {
    super(...args);

    this.siteTypes = this.loadSiteTypesTask.perform();
  }
  // get isWorshipAdministrativeUnit() {
  //   return this.isWorshipService || this.isCentralWorshipService;
  // }

  // get isWorshipService() {
  //   return (go
  //     this.args.administrativeUnitClassification.get('id') ===
  //     CLASSIFICATION_CODE.WORSHIP_SERVICE
  //   );
  // }

  // get isCentralWorshipService() {
  //   return (
  //     this.args.administrativeUnitClassification.get('id') ===
  //     CLASSIFICATION_CODE.CENTRAL_WORSHIP_SERVICE
  //   );
  // }

  // get isMunicipality() {
  //   return (
  //     this.args.administrativeUnitClassification.get('id') ===
  //     CLASSIFICATION_CODE.MUNICIPALITY
  //   );
  // }

  // get isProvince() {
  //   return (
  //     this.args.administrativeUnitClassification.get('id') ===
  //     CLASSIFICATION_CODE.PROVINCE
  //   );
  // }

  // get isDistrict() {
  //   return (
  //     this.args.administrativeUnitClassification.get('id') ===
  //     CLASSIFICATION_CODE.DISTRICT
  //   );
  // }

  // get isAgb() {
  //   return (
  //     this.args.administrativeUnitClassification.get('id') ===
  //     CLASSIFICATION_CODE.AGB
  //   );
  // }

  // get isIGS() {
  //   const typesThatAreIGS = [
  //     CLASSIFICATION_CODE.PROJECTVERENIGING,
  //     CLASSIFICATION_CODE.DIENSTVERLENENDE_VERENIGING,
  //     CLASSIFICATION_CODE.OPDRACHTHOUDENDE_VERENIGING,
  //     CLASSIFICATION_CODE.OPDRACHTHOUDENDE_VERENIGING_MET_PRIVATE_DEELNAME,
  //   ];
  //   return typesThatAreIGS.includes(
  //     this.args.administrativeUnitClassification.get('id')
  //   );
  // }

  // get isApb() {
  //   return (
  //     this.args.administrativeUnitClassification.get('id') ===
  //     CLASSIFICATION_CODE.APB
  //   );
  // }

  @task
  *loadSiteTypesTask() {
    // let allTypes = yield this.store.findAll('site-type', { reload: true });
    let allTypes = yield mockSiteTypes;
    let filteredTypes = [];

    filteredTypes.push(
      allTypes.find((type) => type.id == 'f1381723dec42c0b6ba6492e41d6f5dd') // Maatschappelijke zetel
    );

    if (this.args.selected.content.label === 'Hoofdgebouw erediensten') {
      filteredTypes.push(
        allTypes.find((type) => type.id == 'dd0418307e7038c0c3809e3ec03a0932') // Hoofdgebouw erediensten
      );
    } else if (
      this.args.selected.content.label === 'Gemeentehuis' ||
      this.args.selected.content.label === 'Ander administratief adres'
    ) {
      filteredTypes.push(
        allTypes.find((type) => type.id == '57e8e5498ca84056b8a87631a26c90af') // Gemeentehuis
      );
      filteredTypes.push(
        allTypes.find((type) => type.id == 'fbec5e94aba343b0a7361aca8a0c7d79') // Ander administratief adres
      );
    } else if (this.args.selected.content.label === 'Provinciehuis') {
      filteredTypes.push(
        allTypes.find((type) => type.id == '15f2683c61b74541b27b64b4365806c7') // Provinciehuis
      );
    } else if (this.args.selected.content.label === 'Districtshuis') {
      filteredTypes.push(
        allTypes.find((type) => type.id == 'db13a289b78e42d19d8d1d269b61b18f') // Districtshuis
      );
    }

    return filteredTypes;
  }
}
