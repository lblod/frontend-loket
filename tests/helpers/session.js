import { authenticateSession } from 'ember-simple-auth/test-support';

export const CLASSIFICATION_LABEL = 'classificatieLabel';

const session = async function (server, options = {}) {
  const defaultOptions = {
    roles: [
      'LoketLB-mandaatGebruiker',
      'LoketLB-berichtenGebruiker',
      'LoketLB-bbcdrGebruiker',
      'LoketLB-toezichtGebruiker',
      'LoketLB-leidinggevendenGebruiker',
    ],
  };

  options = Object.assign(defaultOptions, options);

  await authenticateSession({
    data: {
      type: 'sessions',
      id: '5c86864ada98f8000c000015',
      attributes: { roles: options.roles },
    },
    relationships: {
      account: {
        data: {
          type: 'accounts',
          id: '9b875bc387960fd6efa0065bdff32877',
        },
      },
      group: {
        data: {
          type: 'bestuurseenheden',
          id: '974816591f269bb7d74aa1720922651529f3d3b2a787f5c60b73e5a0384950a4',
        },
      },
    },
  });

  const user = server.create('gebruiker', {
    voornaam: 'John',
    achternaam: 'Doe',
  });

  server.create('account', {
    provider: 'https://github.com/lblod/mock-login-service',
    id: '9b875bc387960fd6efa0065bdff32877',
    gebruiker: user,
  });

  const classification = server.create('bestuurseenheid-classificatie-code', {
    label: 'Test',
  });

  server.create('bestuurseenheid', {
    naam: 'ABB',
    id: '974816591f269bb7d74aa1720922651529f3d3b2a787f5c60b73e5a0384950a4',
    classificatie: classification,
  });
};

export default session;
