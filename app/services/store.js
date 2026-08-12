import ArrayProxy from '@ember/array/proxy';
import { useLegacyStore } from '@warp-drive/legacy';
import { JSONAPICache } from '@warp-drive/json-api';

const Store = useLegacyStore({
  legacyRequests: true, // TODO, remove this once we have resolved all legacy request related deprecations
  linksMode: false,
  cache: JSONAPICache,
  handlers: [
    // -- your handlers here
  ],
  schemas: [
    // -- your schemas here
  ],
});

// TODO: switch to util functions instead of custom methods that depend on deprecated APIs.
export default class ExtendedStoreService extends Store {
  /*
   * Executes regulare "query"-method. Queries for only one result and returns that if any.
   */
  async queryOne(modelName, queryOptions, options) {
    const query = queryOptions || {};
    if (!(query['page[size]'] || (query.page && query.page.size))) {
      query['page[size]'] = 1;
    }
    const results = await this.query(modelName, query, options);
    if (results.length) {
      return results[0];
    } else {
      return null;
    }
  }

  async count(modelName, query, options) {
    query = query || {};
    if (!(query['page[size]'] || (query.page && query.page.size))) {
      query['page[size]'] = 1;
    }
    const results = await this.query(modelName, query, options);
    const count = results.meta.count;
    return count;
  }

  findRecordByUri(modelName, uri) {
    const cachedRecord = this.peekAll(modelName).find(
      (item) => item.uri == uri,
    );
    if (cachedRecord) {
      return cachedRecord;
    } else {
      return this.queryOne(modelName, {
        'filter[:uri:]': uri,
      });
    }
  }

  async queryAll(modelName, query, options) {
    query = query || {};
    let batchSize = query['page[size]'] || (query.page && query.page.size);
    if (!batchSize) {
      batchSize = 100;
      query['page[size]'] = batchSize;
    }
    const firstBatch = await this.query(modelName, query, options);
    const count = firstBatch.meta.count;
    const nbOfBatches = Math.ceil(count / batchSize);
    const batches = [];
    for (let i = 1; i < nbOfBatches; i++) {
      const queryForBatch = Object.assign({}, query, {
        'page[size]': batchSize,
        'page[number]': i,
      });
      const batch = this.query(modelName, queryForBatch, options);
      batches.push(batch);
    }

    const otherBatches = await Promise.all(batches);
    return ArrayProxy.create({
      content: [firstBatch, ...otherBatches].flat(),
      meta: {
        count,
      },
    });
  }
}
