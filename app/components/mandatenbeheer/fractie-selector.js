import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerFractieSelectorComponent extends Component {
  @service() store;
  @service() currentSession;

  @tracked _fractie;
  @tracked bestuursorganenId;

  constructor() {
    super(...arguments);
    if (this.args.fractie) this._fractie = this.args.fractie;
    if (this.args.bestuursorganen) {
      this.bestuursorganenId = this.args.bestuursorganen.map((o) =>
        o.get('id'),
      );
    }
  }

  @restartableTask
  *searchByName(searchData) {
    yield timeout(300);
    let queryParams = {
      sort: 'naam',
      include: 'fractietype',
      filter: {
        naam: searchData,
        'bestuursorganen-in-tijd': {
          id: this.bestuursorganenId.join(','),
        },
      },
    };
    let fracties = yield this.store.query('fractie', queryParams);
    fracties = fracties.filter((f) => !f.get('fractietype.isOnafhankelijk'));
    //sets dummy
    if ('onafhankelijk'.includes(searchData.toLowerCase())) {
      fracties.pushObject(yield this.createNewOnafhankelijkeFractie());
    }
    return fracties;
  }

  async createNewOnafhankelijkeFractie() {
    let onafFractie = (await this.store.findAll('fractietype')).find((f) =>
      f.get('isOnafhankelijk'),
    );
    return this.store.createRecord('fractie', {
      naam: 'Onafhankelijk',
      fractietype: onafFractie,
      bestuursorganenInTijd: this.args.bestuursorganen,
      bestuurseenheid: this.bestuurseeneenheid,
    });
  }

  @action
  select(fractie) {
    this._fractie = fractie;
    this.args.onSelect(fractie);
  }
}
