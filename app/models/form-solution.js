import FormSolution from '@lblod/ember-mu-dynamic-forms/models/form-solution' ;
import { belongsTo } from 'ember-data/relationships';

export default FormSolution.extend({
  inzendingVoorToezicht: belongsTo('inzending-voor-toezicht')
});
