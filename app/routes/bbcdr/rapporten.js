import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, DataTableRouteMixin, {
  modelName: 'bbcdr-report',
  mergeQueryOptions(params){
    return {
      sort: params.sort,
      include: [
        'files',
        'last-modifier',
        'status'
      ].join(',')
    };
  }
});
