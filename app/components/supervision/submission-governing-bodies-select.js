import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task, restartableTask, timeout } from 'ember-concurrency';

export default class SupervisionSubmissionGoverningBodiesSelect extends Component {
  @service store;
  @service currentSession;

  @tracked governingBodies = [];
  @tracked selectedGoverningBodyIds = [];
  @tracked bestuur;

  get selectedGoverningBodies() {
    const { governingBodyIds } = this.args;
    if (governingBodyIds && !this.isGoverningBodyLoading) {
      let bodies = this.updateSelectedBodyValue.perform(governingBodyIds);
      return bodies;
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
        bestuurseenheid: {
          ':uri:': this.bestuur.uri,
        },
      },
      include: 'classificatie',
      sort: 'naam',
    });
    this.governingBodies = this.governingBodies.slice();
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

  @task
  *updateSelectedBodyValue(childIds) {
    let children = yield this.store.query('bestuursorgaan', {
      filter: {
        id: childIds,
      },
      include: 'is-tijdsspecialisatie-van',
    });

    let parents = children
      .map((child) => child.isTijdsspecialisatieVan)
      .filter(Boolean);

    let seen = new Set();
    let uniqueParents = parents.filter((parent) => {
      if (seen.has(parent.id)) {
        return false;
      } else {
        seen.add(parent.id);
        return true;
      }
    });

    return uniqueParents;
  }

  @action
  async changeSelectedGoverningBodies(selectedBodies) {
    this.selectedGoverningBodyIds =
      selectedBodies && selectedBodies.map((d) => d.get('id'));

    await this.findTimeSpecification().then((ids) => {
      let governingBodyIds = ids.join(',');
      this.args.onChange(governingBodyIds);
    });
  }

  async findTimeSpecification() {
    let ids = [];

    for (let parentId of this.selectedGoverningBodyIds) {
      let childOrgans = await this.store.query('bestuursorgaan', {
        filter: {
          'is-tijdsspecialisatie-van': {
            ':id:': parentId,
          },
        },
      });

      childOrgans.forEach((o) => ids.push(o.id));
    }

    return ids;
  }
}
