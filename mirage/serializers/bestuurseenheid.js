import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  links(bestuurseenheid) {
    return {
      bestuursorganen: {
        related: `/bestuurseenheden/${bestuurseenheid.id}/bestuursorganen`,
      },
      classificatie: {
        related: `/bestuurseenheden/${bestuurseenheid.id}/classificatie`,
      },
      contactinfo: {
        related: `/bestuurseenheden/${bestuurseenheid.id}/contactinfo`,
      },
      posities: {
        related: `/bestuurseenheden/${bestuurseenheid.id}/posities`,
      },
      primaireSite: {
        related: `/bestuurseenheden/${bestuurseenheid.id}/primaire-site`,
      },
      werkingsgebied: {
        related: `/bestuurseenheden/${bestuurseenheid.id}/werkingsgebied`,
      },
    };
  },
});
