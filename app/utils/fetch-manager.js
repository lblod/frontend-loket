import RequestManager from '@ember-data/request';
import Fetch from '@ember-data/request/fetch';

const fetch = new RequestManager();
// TODO: it seems the fetch handler currently assumes all responses to be json
// which isn't always the case for our micro services, so for those cases we use the standard fetch instead
// A custom handler would be possible, but ideally this is something that comes from EmberData itself.
fetch.use([Fetch]);

export default fetch;
