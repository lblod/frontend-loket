import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import constants from '../config/constants';
import search, { langStringResourceFormat } from '../utils/mu-search';

const { EXECUTING_AUTHORITY_LEVELS, TARGET_AUDIENCES } = constants;

export default class SearchRoute extends Route {
  @service store;
  @service session;

  queryParams = {
    page: {
      refreshModel: true,
    },
    size: {
      refreshModel: true,
    },
    sort: {
      refreshModel: true,
    },
    searchTerm: {
      refreshModel: true,
    },
    themes: {
      refreshModel: true,
    },
    types: {
      refreshModel: true,
    },
    authorities: {
      refreshModel: true,
    },
  };

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params) {
    const [executingAuthorityLevel, targetAudience] = await Promise.all([
      this.store.findRecordByUri('concept', EXECUTING_AUTHORITY_LEVELS.FLEMISH),
      this.store.findRecordByUri('concept', TARGET_AUDIENCES.LOCAL_GOVERNMENT),
    ]);

    const filter = {
      'executingAuthorityLevels.uuid': executingAuthorityLevel.id,
      'targetAudiences.uuid': targetAudience.id,
      isArchived: false,
      ':gte:filterEndDate': new Date().toISOString(),
    };

    this.searchTerm = params.searchTerm;
    filter[':sqs:name.nl^5,description.nl^2,thematicAreas.label'] = isPresent(
      params.searchTerm,
    )
      ? params.searchTerm
      : '*';

    // these params are filters for conceptSchemes that are referred to
    // by the actual concept via 'broader'
    this.themeRecords = [];
    if (params.themes.length) {
      this.themeRecords = await Promise.all(
        params.themes.map((id) => this.store.findRecord('concept', id)),
      );
      filter['thematicAreas.broader.uuid'] = this.themeRecords
        .map((c) => c.id)
        .join(',');
    }

    this.authorityRecords = [];
    if (params.authorities.length) {
      this.authorityRecords = await Promise.all(
        params.authorities.map((id) => this.store.findRecord('concept', id)),
      );
      filter['competentAuthority.uuid'] = this.authorityRecords
        .map((c) => c.id)
        .join(',');
    }

    this.typeRecords = [];
    if (params.types.length) {
      this.typeRecords = await Promise.all(
        params.types.map((id) => this.store.findRecord('concept', id)),
      );
      filter['type.broader.uuid'] = this.typeRecords.map((c) => c.id).join(',');
    }

    return search(
      'public-services',
      params.page,
      params.size,
      params.sort,
      filter,
      ({ id, attributes }) => {
        const product = attributes;
        product.id = id;
        ['name', 'description'].forEach((attr) => {
          product[attr] = langStringResourceFormat(product[attr]);
        });
        ['dateCreated', 'dateModified', 'startDate', 'endDate'].forEach(
          (attr) => {
            const dateStr = product[attr];
            product[attr] = dateStr ? new Date(Date.parse(dateStr)) : null;
          },
        );
        [
          'thematicAreas',
          'executingAuthorityLevels',
          'componentAuthorityLevels',
          'targetAudiences',
        ].forEach((attr) => {
          const value = product[attr];
          product[attr] = value ? (Array.isArray(value) ? value : [value]) : [];
        });
        return product;
      },
    );
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.themeRecords = this.themeRecords || [];
    controller.typeRecords = this.typeRecords || [];
    controller.authorityRecords = this.authorityRecords || [];
    controller.searchTermBuffer = this.searchTerm;
  }
}
