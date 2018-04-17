import Route from '@ember/routing/route';

export default Route.extend({
  BESTUURSEENHEID: '83c7a12a4a8ac8dd82895715095a866dc4794e60de61b967419bdfc1e207ad96',
  queryParams: { persoonFilter: { refreshModel : true } },

  model(){
    return this.get('store').find('bestuurseenheid', this.get('BESTUURSEENHEID'));
  }
});
