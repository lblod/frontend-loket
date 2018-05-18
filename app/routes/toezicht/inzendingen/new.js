import Route from '@ember/routing/route';

export default Route.extend({
  model(){
    return this.get('store').findRecord('form-node', '8a0eae1a867ace6641db65eb1f7d9d4a22927eb614dcf210550d66d801f4481e');
  }
});
