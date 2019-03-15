export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/accounts/:id/gebruiker');
    this.get('/bestuurseenheden/:id');


    http://www.ember-cli-mirage.com/docs/v0.4.x/shorthands/
   */
  this.get('/accounts/:id/gebruiker');
  this.get('/bestuurseenheden/:id');
  this.get('/bestuurseenheden/:id/classificatie', function(schema, request){
    return schema.bestuurseenheidClassificatieCodes.find(request.params.id);
  });
  this.get('/accounts/:id');
  this.get('/conversaties');
  this.get('/bbcdr-reports');
  this.get('/bbcdr-reports/:id');
  this.get('/document-statuses');
  this.get('/bestuursorganen');
  this.get('/mandatarissen');
  this.get('/inzendingen-voor-toezicht');
  this.get('/inzending-voor-toezicht-form-versions');
}
