import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import moment from 'moment';

export default class MandatenbeheerRoute extends Route {
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

    if (!this.currentSession.canAccessMandaat)
      this.router.transitionTo('index');
  }

  async model(params) {
    this.startDate = params.startDate;
    this.endDate = params.endDate;

    const bestuurseenheid = this.currentSession.group;
    const bestuursorganen = await this.getRelevantBestuursorganen(
      bestuurseenheid.get('id')
    );
    const bestuursperiods =
      this.calculateUniqueBestuursperiods(bestuursorganen);
    const selectedPeriod = this.calculateSelectedPeriod(bestuursperiods, {
      startDate: this.startDate,
      endDate: this.endDate,
    });

    const selectedBestuursOrganen = this.getBestuursorganenForPeriod(
      bestuursorganen,
      selectedPeriod
    );

    return RSVP.hash({
      bestuurseenheid,
      bestuursorganen: selectedBestuursOrganen,
      bestuursperiods,
      selectedPeriod,
    });
  }

  calculateUniqueBestuursperiods(bestuursorganen) {
    const periods = bestuursorganen.map((b) => ({
      startDate: moment(b.bindingStart).format('YYYY-MM-DD'),
      endDate: b.bindingEinde
        ? moment(b.bindingEinde).format('YYYY-MM-DD')
        : null,
    }));

    const comparablePeriods = periods.map((period) => JSON.stringify(period));
    const uniquePeriods = [...new Set(comparablePeriods)].map((period) =>
      JSON.parse(period)
    );

    return uniquePeriods;
  }

  calculateSelectedPeriod(periods, { startDate, endDate }) {
    //Note: the assumptions: no messy data, i.e.
    // - no intersection between periods
    // - start < end
    //So, basically it assumes e.g.
    //  - [2001-2003][2003-2023] and possibly [2024-2025|null]
    const sortedPeriods = periods.sortBy('startDate');
    if (!(startDate || endDate)) {
      const today = moment(new Date()).format('YYYY-MM-DD');

      const currentPeriod = sortedPeriods.find(
        (p) => p.startDate <= today && (today < p.endDate || !p.endDate)
      );
      const firstfuturePeriod = sortedPeriods.find((p) => p.startDate > today);
      const firstPreviousPeriod = sortedPeriods.slice(-1)[0];

      return currentPeriod || firstfuturePeriod || firstPreviousPeriod;
    } else {
      return { startDate, endDate };
    }
  }

  getBestuursorganenForPeriod(bestuursorganen, period) {
    return bestuursorganen.filter((b) => {
      const start = moment(b.bindingStart).format('YYYY-MM-DD');
      const end = b.bindingEinde
        ? moment(b.bindingEinde).format('YYYY-MM-DD')
        : null;
      return start == period.startDate && end == period.endDate;
    });
  }

  /*
   * Get all the bestuursorganen in tijd of a bestuursorgaan with at least 1 political or worship mandate.
   * @return Array of bestuursorganen in tijd ressembling the bestuursperiodes
   * TODO: keep in sync with routes/eredienst-mandatenbeheer.
   *       Extract common code once we are sure of the common pattern.
   * TODO: note, this is going to fail once we have more then 20 organen, oh well...
   */
  async getRelevantBestuursorganen(bestuurseenheidId) {
    return (
      await this.store.query('bestuursorgaan', {
        'filter[is-tijdsspecialisatie-van][bestuurseenheid][id]':
          bestuurseenheidId,
        'filter[:has:bevat]': true, // only organs with a political mandate
      })
    ).slice(); // TODO, it should be possible to remove .slice after updating to EmberData v5. Something calls toArray and triggers a deprecation on v4.
  }
}
