import RequestManager from '@ember-data/request';
import Fetch from '@ember-data/request/fetch';

const fetch = new RequestManager();
// TODO: it seems the fetch handler assumes all responses to be json, which isn't always the case for us
// A custom handler would be possible, but I'm not sure if we should copy paste the upstream code and modify it.
// Seems like a bad idea?
fetch.use([Fetch]);

export default fetch;
