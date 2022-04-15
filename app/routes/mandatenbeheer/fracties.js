import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class MandatenbeheerFractiesRoute extends Route {
  beforeModel() {
    const mandatenbeheer = this.modelFor('mandatenbeheer');
    this.set('mandatenbeheer', mandatenbeheer);
  }

  model() {
    const bestuursorganenIds = this.mandatenbeheer.bestuursorganen.map((o) =>
      o.get('id')
    );

    return this.store.query('fractie', {
      sort: 'naam',
      page: { size: 1000 },
      'filter[bestuursorganen-in-tijd][id]': bestuursorganenIds.join(','),
    });
  }

  async afterModel() {
    const defaultFractieType = (
      await this.store.query('fractietype', {
        page: { size: 1 },
        'filter[:uri:]':
          'http://data.vlaanderen.be/id/concept/Fractietype/Samenwerkingsverband',
      })
    ).firstObject;
    this.set('defaultFractieType', defaultFractieType);
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    controller.set('mandatenbeheer', this.mandatenbeheer);
    controller.set('defaultFractieType', this.defaultFractieType);
  }

  @action
  reloadModel() {
    this.refresh();
  }
}
