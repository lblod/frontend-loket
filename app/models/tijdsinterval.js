import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  begin: attr('date'),
  einde: attr('date')
});
