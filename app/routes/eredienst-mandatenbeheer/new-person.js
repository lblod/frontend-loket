import Route from '@ember/routing/route';

export default class EredienstMandatenbeheerNewPersonRoute extends Route {
  queryParams = {
    firstName: {
      refreshModel: true,
    },
    lastName: {
      refreshModel: true,
    },
    rijksregisternummer: {
      refreshModel: true,
    },
  };
}
