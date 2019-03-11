import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession, authenticateSession, invalidateSession} from 'ember-simple-auth/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | toezicht index', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  test('authenticated users can visit /toezicht/inzendingen', async function(assert) {
    await authenticateSession(
      {
        "data":{
          "type":"sessions",
          "id":"5c86864ada98f8000c000015",
          "attributes":{"roles":["LoketLB-mandaatGebruiker","LoketLB-berichtenGebruiker","LoketLB-bbcdrGebruiker","LoketLB-toezichtGebruiker","LoketLB-leidinggevendenGebruiker","LoketLB-toezichtGebruiker","LoketLB-leidinggevendenGebruiker","LoketLB-bbcdrGebruiker","LoketLB-berichtenGebruiker","LoketLB-mandaatGebruiker"]}},
        "relationships":{
          "account":{
            "data":{"type":"accounts","id":"9b875bc387960fd6efa0065bdff32877"}},
          "group":{
            "data":{"type":"bestuurseenheden","id":"974816591f269bb7d74aa1720922651529f3d3b2a787f5c60b73e5a0384950a4"}
          }
        }
      }
    );
    const user = this.server.create('gebruiker', {
      voornaam: "John",
      achternaam: "Doe"
    });
    const acc = this.server.create('account', {
      "provider":"https://github.com/lblod/mock-login-service",
      "id":"9b875bc387960fd6efa0065bdff32877",
      "gebruiker": user
    });
    const bestuurseenheid = this.server.create('bestuurseenheid', {
      id: "974816591f269bb7d74aa1720922651529f3d3b2a787f5c60b73e5a0384950a4"
    });
    await visit('/toezicht/inzendingen');
    assert.equal(currentURL(), '/toezicht/inzendingen', 'user is on super-secret-url');
  });
});
