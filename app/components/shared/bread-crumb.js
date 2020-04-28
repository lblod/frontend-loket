import Component from '@glimmer/component';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default class SharedBreadCrumbComponent extends Component {
@service router;
  // @TODO use isActive for less maintenance
  @equal('router.currentRouteName', 'toezicht.inzendingen.index') isToezicht;
  @equal('router.currentRouteName', 'toezicht.inzendingen.edit') isToezichtDossier;
  @equal('router.currentRouteName', 'toezicht.inzendingen.new') isToezichtDossierNew;

  @equal('router.currentRouteName', 'berichtencentrum.berichten.index') isBerichten;
  @equal('router.currentRouteName', 'berichtencentrum.berichten.conversatie.index') isBerichtenDossier;

  @equal('router.currentRouteName', 'bbcdr.rapporten.index') isBbcdr;
  @equal('router.currentRouteName', 'bbcdr.rapporten.edit') isBbcdrDossier;
  @equal('router.currentRouteName', 'bbcdr.rapporten.new') isBbcdrDossierNew;

  @equal('router.currentRouteName', 'mandatenbeheer.mandatarissen.index') isMandaten;
  @equal('router.currentRouteName', 'mandatenbeheer.mandatarissen.edit') isMandaatBewerk;
  @equal('router.currentRouteName', 'mandatenbeheer.mandatarissen.new') isMandaatNieuw;
  @equal('router.currentRouteName', 'mandatenbeheer.mandatarissen.new-person') isNieuwePersoon;
  @equal('router.currentRouteName', 'mandatenbeheer.fracties.index') isFracties;

  @equal('router.currentRouteName', 'leidinggevendenbeheer.bestuursfuncties.index') isLeidinggevenden;
  @equal('router.currentRouteName', 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index') isFunctionaris;
  @equal('router.currentRouteName', 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.edit') isFunctionarisBewerk;
  @equal('router.currentRouteName', 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.index') isFunctionarisNieuweAanstellingsperiode;
  @equal('router.currentRouteName', 'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.contact-info') isFunctionarisContact;

  @equal('router.currentRouteName', 'personeelsbeheer.personeelsaantallen.index') isPersoneel;
  @equal('router.currentRouteName', 'personeelsbeheer.personeelsaantallen.periodes.edit') isPersoneelAantallen;
}
