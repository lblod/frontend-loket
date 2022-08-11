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
    endDate: { refreshModel: true },
  };

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (!this.currentSession.canAccessEredienstMandatenbeheer)
      this.router.transitionTo('index');
  }

  //TODO: this was based on mandatenbeheer, but turned out we needed to modify this,
  //     since a lot of edge cases weren't taken into account.
  //     Most likely we just fixed bugs, and these changes should be merged back again to mandatenbeheer
  async model(params) {
    this.startDate = params.startDate;
    this.endDate = params.endDate;

    const bestuurseenheid = this.currentSession.group;

    return RSVP.hash({
      bestuurseenheid: bestuurseenheid,
      bestuursorganen: this.getBestuursorganenInTijdByPeriod(
        bestuurseenheid.get('id')
      ),
      bestuursperioden: this.getBestuursperioden(bestuurseenheid.get('id')),
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  /*
   * Returns bestuursorgaan in tijd starting on the given start date
   * for all bestuursorganen of the given bestuurseenheid.
   * TODO: ripped from routes/mandatenbeheer (BUT MODIFIED due to probably a bug in mandatenbeheer).
   *       Extract common code once we are sure of the common pattern.
   */
  async getBestuursorganenInTijdByPeriod(bestuurseenheidId) {
    const bestuursorganen = await this.store.query('bestuursorgaan', {
      'filter[bestuurseenheid][id]': bestuurseenheidId,
      'filter[heeft-tijdsspecialisaties][:has:bevat]': true, // only organs with a mandate
    });

    let organenStartingOnStartDate = [];

    for (const bestuursorgaan of bestuursorganen.toArray()) {
      const organen = await this.getBestuursorgaanInTijdByPeriod(
        bestuursorgaan.get('id'),
        this.startDate,
        this.endDate
      );
      organenStartingOnStartDate = [...organenStartingOnStartDate, ...organen];
    }

    return organenStartingOnStartDate.filter((orgaan) => orgaan); // filter null values
  }

  /*
   * TODO: ripped from routes/mandatenbeheer.
   *       Extract common code once we are sure of the common pattern.
   */
  async getBestuursorgaanInTijdByPeriod(bestuursorgaanId, startDate, endDate) {
    const queryParams = {
      sort: '-binding-start',
      'filter[is-tijdsspecialisatie-van][id]': bestuursorgaanId,
    };

    if (startDate && endDate) {
      queryParams['filter[binding-start]'] = startDate;
      queryParams['filter[binding-einde]'] = endDate;
    } else if (startDate) {
      queryParams['filter[binding-start]'] = startDate;
      // Bestuursorganen can overlap in start date,
      // so if no end date is provided, explicitly filter em out
      queryParams['filter[:has-no:binding-einde]'] = true;
    }

    const organen = await this.store.query('bestuursorgaan', queryParams);
    return organen.toArray();
  }

  /*
   * Get all the bestuursorganen in tijd of a bestuursorgaan with at least 1 political mandate.
   * @return Array of bestuursorganen in tijd ressembling the bestuursperiodes
   * TODO: ripped from routes/mandatenbeheer (BUT MODIFIED due to probably a bug in mandatenbeheer)
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
