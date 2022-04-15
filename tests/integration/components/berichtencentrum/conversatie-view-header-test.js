import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module(
  'Integration | Component | berichtencentrum/conversatie-view-header',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      const classificatieCode = {
        label: 'Gemeente',
        scopeNote: undefined,
        uri: 'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001',
      };

      const bestuurseenheidAalst = {
        classificatie: classificatieCode,
        mailAdres: 'bestuursondersteuning@aalst.Be',
        naam: 'Aalst',
        politiezone: null,
        primaireSite: null,
        werkingsgebied: null,
        wilMailOntvangen: true,
      };

      const bestuurseenheidABB = {
        classificatie: null,
        mailAdres: null,
        naam: 'Agentschap Binnenlands Bestuur',
        politiezone: null,
        primaireSite: null,
        werkingsgebied: null,
        wilMailOntvangen: false,
      };

      const file = EmberObject.create({
        created: null,
        extension: 'pdf',
        filename: '20190208_CBS_Aalst_2019.000053.pdf',
        format: 'application/pdf; charset=binary',
        size: 455122,
        uri: 'http://mu.semte.ch/services/file-service/files/5c5d94ee76f162000d000000',
      });

      const bericht = {
        aangekomen: '2019-02-08T00:00:00.000Z',
        auteur: null,
        bijlagen: [file],
        inhoud: null,
        naar: null,
        van: bestuurseenheidABB,
        verzonden: '2019-02-08T00:00:00.000Z',
      };

      const model = {
        classificatieCode: {
          label: 'Gemeente',
          scopeNote: undefined,
          uri: 'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001',
        },

        bijlagen: [file],

        berichten: [
          {
            aangekomen: '2019-02-08T00:00:00.000Z',
            auteur: null,
            bijlagen: [file],
            inhoud: null,
            naar: null,
            van: bestuurseenheidABB,
            verzonden: '2019-02-08T00:00:00.000Z',
          },
        ],

        conversatie: {
          betreft: 'KLACHT2019.000053 tegen Stad  Aalst: antwoord aan bestuur',
          dossiernummer: 'KLACHT2019.000053',
          laatsteBericht: bericht,
          reactietermijn: 'P31D',
          typeCommunicatie: 'Kennisname toezichtsbeslissing',
        },

        gebruiker: {
          achternaam: 'Aalst',
          bestuurseenheden: [bestuurseenheidAalst],
          rijksregisterNummer: undefined,
          voornaam: 'Gemeente',
        },
      };

      this.set('model', model);
    });

    test('the compoenent renders and shows a dossiernummer, a typeCommunicatie, a cross and a betreft', async function (assert) {
      await render(
        hbs`{{berichtencentrum/conversatie-view-header conversatie=model}}`
      );

      assert
        .dom(`[data-test-loket=berichtencentrum-header-dossiernummer]`)
        .exists();
      assert
        .dom(`[data-test-loket=berichtencentrum-header-type-communicatie]`)
        .exists();
      assert.dom(`[data-test-loket=berichtencentrum-header-cross]`).exists();
      assert.dom(`[data-test-loket=berichtencentrum-header-betreft]`).exists();
    });

    test('it calls the given onclick handler when the cross is clicked', async function (assert) {
      this.set('crossClicked', false);
      this.set('close', function () {
        this.set('crossClicked', !this.crossClicked);
        assert.step('cross-clicked');
      });

      await render(
        hbs`{{berichtencentrum/conversatie-view-header conversatie=model close=close crossClicked=crossClicked}}`
      );

      assert.false(this.crossClicked);
      await click('[data-test-loket=berichtencentrum-header-cross]');
      assert.true(this.crossClicked);

      assert.verifySteps(['cross-clicked']);
    });
  }
);
