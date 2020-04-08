import DS from 'ember-data';
const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
  created: attr('datetime',  {
    defaultValue(){
      return new Date();
    }
  }),
  modified: attr('datetime',  {
    defaultValue(){
      return new Date();
    }
  }),
  sentDate: attr('datetime'),
  receivedDate: attr('datetime'),
  lastModifier: belongsTo('gebruiker'),
  formData: belongsTo('form-data'),
  source: attr(),

  uri: attr(),
  href: attr(),
  organization: belongsTo('bestuurseenheid'),
  publisher: belongsTo('vendor'),
  submissionDocument: belongsTo('submission-document'),
  status: belongsTo('submission-document-status'),
  files: hasMany('file'),
  task: belongsTo('automatic-submission-task')
});
