import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerPersoonMandatenEditComponent extends Component {
  @service() store;

  @tracked mandatarissen;

  constructor() {
    super(...arguments);
    this.initComponentProperties();
  }

  async initComponentProperties() {
    let bestuursorganenIds = this.args.bestuursorganen.map((o) => o.get('id'));
    let queryParams = {
      filter: {
        'is-bestuurlijke-alias-van': {
          id: this.args.persoon.id,
        },
        bekleedt: {
          'bevat-in': {
            id: bestuursorganenIds.join(','),
          },
        },
      },
      include: [
        'is-bestuurlijke-alias-van',
        'bekleedt.bestuursfunctie',
        'beleidsdomein',
        'heeft-lidmaatschap.binnen-fractie',
      ].join(','),
    };

    let mandatarissen = await this.store.query('mandataris', queryParams);
    this.mandatarissen = mandatarissen.slice();
  }

  @action
  mandatarisSaved(mandataris) {
    //here you can do some additional validation, e.g. validation over all mandaten for a person
    this.onMandatarisSaved(mandataris);
  }

  @action
  async mandatarisCreateCanceled(mandataris) {
    await mandataris.destroy();
    this.mandatarissen.removeObject(mandataris);
  }

  @action
  async createMandataris() {
    const mandataris = this.store.createRecord('mandataris');
    mandataris.set('isBestuurlijkeAliasVan', await this.args.persoon);
    this.mandatarissen.pushObject(mandataris);
  }

  @action
  async updateVerifiedMandaten() {
    await this.args.persoon.set(
      'verifiedMandaten',
      !this.args.persoon.verifiedMandaten
    );
    await this.args.persoon.save();
  }

  @action
  finish() {
    this.args.onFinish();
  }
}
