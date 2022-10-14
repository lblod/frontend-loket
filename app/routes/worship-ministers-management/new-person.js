import Route from '@ember/routing/route';

export default class WorshipMinistersManagementNewPersonRoute extends Route {
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
