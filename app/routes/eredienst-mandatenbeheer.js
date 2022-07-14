import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class EredienstMandatenbeheerRoute extends Route {
  @service currentSession;
  @service session;
  @service router;
  @service store;

  queryParams = {
    startDate: { refreshModel: true },
  };

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (!this.currentSession.canAccessEredienstMandatenbeheer)
      this.router.transitionTo('index');
  }

  async model(params) {
    this.startDate = params.startDate;
    const bestuurseenheid = this.currentSession.group;

    return RSVP.hash({
      bestuurseenheid: bestuurseenheid,
      bestuursorganen: this.getBestuursorganenInTijdByStartDate(
        bestuurseenheid.get('id')
      ),
      bestuursperioden: this.getBestuursperioden(bestuurseenheid.get('id')),
      startDate: this.startDate,
    });
  }

  /*
   * Returns bestuursorgaan in tijd starting on the given start date
   * for all bestuursorganen of the given bestuurseenheid.
   * TODO: ripped from routes/mandatenbeheer.
   *       Extract common code once we are sure of the common pattern.
   */
  async getBestuursorganenInTijdByStartDate(bestuurseenheidId) {
    const bestuursorganen = await this.store.query('bestuursorgaan', {
      'filter[bestuurseenheid][id]': bestuurseenheidId,
      'filter[heeft-tijdsspecialisaties][:has:bevat]': true, // only organs with a mandate
    });
    const organenStartingOnStartDate = await Promise.all(
      bestuursorganen.map((orgaan) => {
        return this.getBestuursorgaanInTijdByStartDate(
          orgaan.get('id'),
          this.startDate
        );
      })
    );
    return organenStartingOnStartDate.filter((orgaan) => orgaan); // filter null values
  }

  /*
   * TODO: ripped from routes/mandatenbeheer.
   *       Extract common code once we are sure of the common pattern.
   */
  async getBestuursorgaanInTijdByStartDate(bestuursorgaanId, startDate) {
    const queryParams = {
      page: { size: 1 },
      sort: '-binding-start',
      'filter[is-tijdsspecialisatie-van][id]': bestuursorgaanId,
    };

    if (startDate) queryParams['filter[binding-start]'] = startDate;

    const organen = await this.store.query('bestuursorgaan', queryParams);
    return organen.firstObject;
  }

  /*
   * Get all the bestuursorganen in tijd of a bestuursorgaan with at least 1 political mandate.
   * @return Array of bestuursorganen in tijd ressembling the bestuursperiodes
   * TODO: ripped from routes/mandatenbeheer.
   *       Extract common code once we are sure of the common pattern.
   */
  async getBestuursperioden(bestuurseenheidId) {
    return await this.store.query('bestuursorgaan', {
      'filter[is-tijdsspecialisatie-van][bestuurseenheid][id]':
        bestuurseenheidId,
      'filter[:has:bevat]': true, // only organs with a political mandate
    });
  }
}
