// Inlined from https://github.com/mu-semtech/ember-mu-transform-helpers
// Specific commit: https://github.com/mu-semtech/ember-mu-transform-helpers/commit/56ca9db51f46f5d358d1a362966082dd1276e1ef

import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import Transform from '@ember-data/serializer/transform';

const LangString = function (content, lang) {
  this.content = content;
  this.language = lang;
  this.toString = function () {
    return `${this['content']} (${this['language']})`;
  };
};

export default class LanguageStringSetTransform extends Transform {
  deserialize(serialized) {
    assert(
      `Expected array but got ${typeOf(serialized)}`,
      !serialized || typeOf(serialized) === 'array',
    );
    serialized = serialized.map(function (item) {
      return new LangString(item['content'], item['language']);
    });

    serialized.first = (language) => {
      return serialized.find((langString) => langString.language == language)
        ?.content;
    };

    serialized.lang = (language) => {
      return serialized
        .filter((langString) => langString.language == language)
        .map((langString) => langString.content);
    };

    serialized.default = serialized.first('nl');

    return serialized;
  }

  serialize(deserialized) {
    assert(
      `Expected array but got ${typeOf(deserialized)}`,
      !deserialized || typeOf(deserialized) === 'array',
    );
    return deserialized;
  }
}
