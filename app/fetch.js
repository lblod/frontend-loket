import RequestManager from '@ember-data/request';
import Fetch from '@ember-data/request/fetch';

const fetch = new RequestManager();
fetch.use([Fetch]);

export default fetch;
