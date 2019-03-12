import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  links(bestuurseenheid) {
    return {
      classificatie: {
        related: `/bestuurseenheden/${bestuurseenheid.id}/classificatie`
      }
    }
  }
});
