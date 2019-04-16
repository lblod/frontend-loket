import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupSession from '../helpers/session';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | mandatenbeheer', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function(){

    this.server.create('bestuurseenheid', {
      "naam":"Aalst",
      "mailAdres":null,
      "wilMailOntvangen":false,
      "werkingsgebied":null,
      "primaireSite":null,
      "politiezone":null
    });

    const bestuursorgaan = this.server.create('bestuursorgaan', {
      "uri":"http://data.lblod.info/id/bestuursorganen/d0396dfae7bb83b0688c4fe0bdee03519e84d05d9b3f12e29ee7c31a165ad3b7",
      "naam":"Burgemeester Aalst",
      "bindingStart":null,
      "bindingEinde":null,
      "bestuurseenheid":null,
      "classificatie":null,
      "isTijdsspecialisatieVan":null,
      "wordtSamengesteldDoor":null
    });


    const bestuursfunctie = this.server.create('bestuursfunctieCode', {
      "uri":"http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000013",
      "label":"Burgemeester"
    });

    const persoon = this.server.create('persoon',{
      "achternaam":"D'Haese",
      "gebruikteVoornaam":"Christoph",
      "geboorte":null,
      "identificator":null,
      "geslacht":null
    });

    const mandaat = this.server.create('mandaat', {
      "bestuursfunctie": bestuursfunctie
    });

    this.server.create('bestuursorgaan', {
      "uri":"http://data.lblod.info/id/bestuursorganen/509d93f78ffc107fc368edfc879fb931b52cbbd8597f6e94e6c33a16901f4481",
      "bindingStart":"2012-10-14",
      "bindingEinde":"2019-01-01",
      "bestuurseenheid":null,
      "classificatie":null,
      "isTijdsspecialisatieVan": bestuursorgaan,
      "wordtSamengesteldDoor":null,
      bevat: [ mandaat ]
    });

    this.server.create('mandataris',{
      "start":"2019-01-01T00:00:00.000Z",
      "einde":null,
      "bekleedt": mandaat,
      "heeftLidmaatschap":null,
      "isBestuurlijkeAliasVan": persoon,
      "status":null
    });

  });

  test('visiting /mandatenbeheer', async function(assert) {
    this.server.logging = true;
    await setupSession(this.server);

    await visit('/mandatenbeheer/mandatarissen');

    assert.equal(currentURL(), '/mandatenbeheer/mandatarissen');
    assert.dom(`[data-test-loket=mandatarissen-body]>tr`).exists({ count: 1 });
  });
});
