import Route from '@ember/routing/route';

export default Route.extend({

    modelName: 'conversatie',

    async model () {

        let data = this.store.findAll('conversatie');
        return data;
    }

});
