import { formatDate, isSameIsoDate } from './date';

/*
 * Assuming bestuursorganen in tijd are passed linked to mandates.
 * This function sets the mandate and the end dates from the array of bestuursorganenInTijd where records are ordered by DESC,
 * so the greatest binding-einde is the expectedEndDate for each selected mandate.
 * @returns an object with warning messages as properties if any warnings need to be shown
 */
export async function setMandate(store, mandataris, mandaat) {
  const currentMandate = await mandataris.bekleedt;
  const hasCurrentMandate = Boolean(currentMandate);

  const bestuursfunctie = await mandaat.bestuursfunctie;

  const currentEndDate = mandataris.einde;
  const isCurrentlyEmpty = !currentEndDate;

  let warnings;

  if (isLifetimeBoardPosition(bestuursfunctie)) {
    mandataris.expectedEndDate = undefined;
    mandataris.einde = undefined;

    if (hasCurrentMandate && !isCurrentlyEmpty) {
      warnings = {
        einde:
          'De einddatum werd automatisch aangepast. Gelieve de einddatum te controleren.',
      };
    }
  } else {
    const expectedEndDate = await getExpectedEndDateForPosition(store, mandaat);
    mandataris.expectedEndDate = expectedEndDate;
    mandataris.einde = expectedEndDate;
    let wasLifeTimeBoardPosition = false;

    if (hasCurrentMandate) {
      const previousBestuursfunctie = await currentMandate.bestuursfunctie;
      wasLifeTimeBoardPosition = isLifetimeBoardPosition(
        previousBestuursfunctie
      );
    }

    if (
      hasCurrentMandate &&
      (!isCurrentlyEmpty || (isCurrentlyEmpty && wasLifeTimeBoardPosition)) &&
      !isSameIsoDate(expectedEndDate, currentEndDate)
    ) {
      warnings = {
        einde:
          'De einddatum werd automatisch aangepast naar de nieuwe geplande einddatum. Gelieve de einddatum te controleren.',
      };
    }
  }

  mandataris.bekleedt = mandaat;
  mandataris.errors?.remove('bekleedt');
  return warnings;
}

async function getExpectedEndDateForPosition(store, mandaat) {
  let bestuursorganenInTijd = await store.query('bestuursorgaan', {
    'filter[bevat][:uri:]': mandaat.uri,
    sort: '-binding-start',
  });
  let expectedEndDates = bestuursorganenInTijd.map(
    (bestuursorgaan) => bestuursorgaan.bindingEinde
  );

  return expectedEndDates[0];
}

export function isLifetimeBoardPosition(boardPosition) {
  const lifetimeBoardPosition =
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5972fccd87f864c4ec06bfbd20b5008b'; // Bestuurslid (van rechtswege) is a lifetime mandate

  return boardPosition.uri === lifetimeBoardPosition;
}

/**
 * Gets `activeTimePeriodes` for the selected `mandate`.
 * @param {Object} mandate Mandate record
 * @param {Object} store Ember store
 * @returns {Object} Active time periodes
 */
export async function getActiveTimePeriodes(mandate, store) {
  let bestuursorganenInTijd = await store.query('bestuursorgaan', {
    'filter[bevat][:uri:]': mandate.uri,
    sort: 'binding-start',
  });

  let activeTimePeriodes = bestuursorganenInTijd.map((bestuursorgaan) => {
    return {
      bindingStart: bestuursorgaan.bindingStart,
      bindingEinde: bestuursorgaan.bindingEinde,
    };
  });

  return activeTimePeriodes;
}

/**
 * Checks the mandate time periode limit, if it falls outside, we show a warning message to the user.
 *
 * NB : Lifetime mandates does not trigger warning messages.
 * @param {Object} mandate Mandate record
 * @param {Object} store Ember store
 * @param {Date} startDate Mandate starting date
 * @param {Date} endDate Mandate ending date
 * @returns {Object} Corresponding warning message with the {startDate} and {endDate} cases.
 */
export async function warnOnMandateExceededTimePeriode(
  mandate,
  store,
  startDate,
  endDate
) {
  if (!(await mandate)) {
    return; // Handling the case where we create a new worship-mandatee.
  }
  const activeTimePeriodes = await getActiveTimePeriodes(mandate, store);
  let activeTimePeriodeLimitStart;
  let activeTimePeriodeLimitEnd;
  let warningMessages = {};
  const { label } = await mandate.bestuursfunctie;
  // Maybe we should use uri instead
  switch (label) {
    case 'Voorzitter van het bestuur van de eredienst':
    case 'Penningmeester van het bestuur van de eredienst':
    case 'Secretaris van het bestuur van de eredienst':
      activeTimePeriodeLimitStart = activeTimePeriodes[0].bindingStart;
      activeTimePeriodeLimitEnd = activeTimePeriodes[0].bindingEinde;
      break;
    case 'Bestuurslid van het bestuur van de eredienst (Grote Helft)':
    case 'Bestuurslid van het bestuur van de eredienst (Kleine Helft)':
      activeTimePeriodeLimitStart = activeTimePeriodes[0].bindingStart;
      activeTimePeriodeLimitEnd = activeTimePeriodes[1].bindingEinde;
      break;
    case 'Bestuurslid (van rechtswege) van het bestuur van de eredienst':
      return; // no warnings needed for lifetime mandate
    default:
    // Handle unexpected ministerType
  }

  if (startDate < activeTimePeriodeLimitStart) {
    warningMessages.startDateMessage = `De startdatum ${formatDate(
      startDate
    )} valt voor de voorgestelde startdatum van de bestuursperiode ${formatDate(
      activeTimePeriodeLimitStart
    )}.`;
  }
  if (endDate > activeTimePeriodeLimitEnd) {
    warningMessages.endDateMessage = `De einddatum ${formatDate(
      endDate
    )} valt voor de voorgestelde einddatum van de bestuursperiode ${formatDate(
      activeTimePeriodeLimitEnd
    )}.`;
  }

  return warningMessages;
}
