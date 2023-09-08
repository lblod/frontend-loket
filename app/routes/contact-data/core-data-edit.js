import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import { createValidatedChangeset } from '../../utils/changeset';
import { getAddressValidations } from 'frontend-loket/validations/address';
import coreDataValidations from 'frontend-loket/validations/coreData';
import contactValidations from 'frontend-loket/validations/contact-point';
import secondaryContactValidations from 'frontend-loket/validations/secondary-contact-point';

export default class CoreDataEditRoute extends Route {
  @service currentSession;
  @service store;

  demoRecord = undefined;

  _insertDemoRecord() {
    this.demoRecord = EmberObject.create({
      name: 'Aalst',
      classification: EmberObject.create({
        label: 'OCMW',
      }),
      organizationStatus: EmberObject.create({
        id: '63cc561de9188d64ba5840a42ae8f0d6',
        label: 'Actief',
      }),
      identifiers: [
        EmberObject.create({
          idName: 'KBO nummer',
          structuredIdentifier: EmberObject.create({
            localId: '0212.237.186',
          }),
        }),
        EmberObject.create({
          idName: 'SharePoint identificator',
          structuredIdentifier: EmberObject.create({
            localId: 'flqskjdfqkjsd',
          }),
        }),
        EmberObject.create({
          idName: 'OVO-nummer',
          structuredIdentifier: EmberObject.create({
            localId: 'OVO002601',
          }),
        }),
      ],
      primarySite: EmberObject.create({
        address: EmberObject.create({}),
        contacts: [
          EmberObject.create({
            telephone: '081 00 0000',
            email: 'fakeemail@gmail.com',
            website: 'https://google.com',
          }),
          EmberObject.create({
            telephone: '081 00 0002',
            email: 'fakeemail2@gmail.com',
            website: 'https://wikipedia.org',
          }),
        ],
      }),
    });
    return this.demoRecord;
  }

  async model() {
    // This is demo code with a hardcoded record
    // Normally this should be an ember model
    const administrativeUnitRecord =
      this.demoRecord ?? this._insertDemoRecord();

    const address = administrativeUnitRecord.primarySite.address;

    const kbo = administrativeUnitRecord.identifiers.find(
      (sub) => sub.idName === 'KBO nummer'
    ).structuredIdentifier.localId;
    const ovo = administrativeUnitRecord.identifiers.find(
      (sub) => sub.idName === 'OVO-nummer'
    ).structuredIdentifier.localId;

    const coreData = EmberObject.create({
      name: administrativeUnitRecord.name,
      adminType: administrativeUnitRecord.classification.label,
      region: 'Onbekend',
      status: administrativeUnitRecord.organizationStatus.label,
      kbo,
      nis: '0',
      ovo,
    });

    return {
      administrativeUnit: administrativeUnitRecord,
      coreData: createValidatedChangeset(coreData, coreDataValidations),
      address: createValidatedChangeset(address, getAddressValidations(true)),
      primaryContact: createValidatedChangeset(
        administrativeUnitRecord.primarySite.contacts[0],
        contactValidations
      ),
      secondaryContact: createValidatedChangeset(
        administrativeUnitRecord.primarySite.contacts[1],
        secondaryContactValidations
      ),
    };
  }
}
