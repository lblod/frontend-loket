import Controller from '@ember/controller';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  currentSession: service(),
  router: service(),

  isIndex: equal('router.currentRouteName', 'index'),

  // @TODO use isActive for less maintenance
  isToezicht: equal('router.currentRouteName', 'toezicht.inzendingen.index'),
  isToezichtDossier: equal('router.currentRouteName', 'toezicht.inzendingen.edit'),

  isBerichten: equal('router.currentRouteName', 'berichtencentrum.berichten.index'),
  isBerichtenDossier: equal('router.currentRouteName', 'berichtencentrum.berichten.conversatie.index'),

  isBbcdr: equal('router.currentRouteName', 'bbcdr.rapporten.index'),
  isBbcdrDossier: equal('router.currentRouteName', 'bbcdr.rapporten.edit'),

  isMandaten: equal('router.currentRouteName', 'mandatenbeheer.mandatarissen.index'),
  isMandaatBewerk: equal('router.currentRouteName', 'mandatenbeheer.mandatarissen.edit'),
  isMandaatNieuw: equal('router.currentRouteName', 'mandatenbeheer.mandatarissen.new'),
  isNieuwePersoon: equal('router.currentRouteName', 'mandatenbeheer.mandatarissen.new-person'),
  isFracties: equal('router.currentRouteName', 'mandatenbeheer.fracties.index'),

  isLeidinggevenden: equal('router.currentRouteName', 'leidinggevendenbeheer.bestuursfuncties.index'),
  isFunctionaris: equal('router.currentRouteName', 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index'),
  isFunctionarisBewerk: equal('router.currentRouteName', 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.edit'),
  isFunctionarisNieuweAanstellingsperiode: equal('router.currentRouteName', 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.index'),
  isFunctionarisContact: equal('router.currentRouteName', 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.contact-info'),

  isPersoneel: equal('router.currentRouteName', 'personeelsbeheer.personeelsaantallen.index'),
  isPersoneelAantallen: equal('router.currentRouteName', 'personeelsbeheer.personeelsaantallen.periodes.edit')
});
