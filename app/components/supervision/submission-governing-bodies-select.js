import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task, restartableTask, timeout } from 'ember-concurrency';

export default class SupervisionSubmissionGoverningBodiesSelect extends Component {
  @service store;
  @service currentSession;

  @tracked governingBodies = [];
  @tracked bestuur;

  get selectedGoverningBodies() {
    const { governingBodyIds } = this.args;
    if (governingBodyIds && !this.isGoverningBodyLoading) {
      return this.governingBodies.filter((body) =>
        governingBodyIds.split(',').includes(body.id),
      );
    }

    return [];
  }

  get isGoverningBodyLoading() {
    return this.governingBodies.length === 0;
  }

  constructor() {
    super(...arguments);
    this.bestuur = this.currentSession.group;
    this.loadData.perform();
  }

  @task
  *loadData() {
    this.governingBodies = yield this.store.query('bestuursorgaan', {
      filter: {
        ':has-no:bevat-bestuursfunctie': true,
        bestuurseenheid: {
          ':uri:': this.bestuur.uri,
        },
      },
      include: 'heeft-tijdsspecialisaties',
      sort: 'naam',
    });
    this.governingBodies = this.governingBodies.slice();
    this.governingBodies = this.governingBodies.filter(
      orgaan => orgaan.hasMany('heeftTijdsspecialisaties').value().length > 1
    );
  }

  @restartableTask
  *searchGoverningBody(term) {
    yield timeout(600);
    let results = yield this.store.query('bestuursorgaan', {
      filter: {
        bestuurseenheid: {
          ':uri:': this.bestuur.uri,
        },
        naam: term,
      },
      include: 'classificatie',
      sort: 'naam',
    });

    return results.slice();
  }

  @action
  changeSelectedGoverningBodies(selectedBodies) {
    let governingBodyIds =
      selectedBodies && selectedBodies.map((d) => d.id).join(',');
    this.args.onChange(governingBodyIds);
  }
}
