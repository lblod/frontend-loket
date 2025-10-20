import LanguageStringSetTransform from 'ember-mu-transform-helpers/transforms/language-string-set';

// Inlines the code from this commit so we don't need to use a github branch as a dependency
// https://github.com/mu-semtech/ember-mu-transform-helpers/commit/56ca9db51f46f5d358d1a362966082dd1276e1ef

export default class LanguageStringSet extends LanguageStringSetTransform {
  deserialize(serialized) {
    const deserialized = super.deserialize(serialized);

    deserialized.first = (language) => {
      return deserialized.find((langString) => langString.language == language)
        ?.content;
    };

    deserialized.lang = (language) => {
      return deserialized
        .filter((langString) => langString.language == language)
        .map((langString) => langString.content);
    };

    deserialized.default = deserialized.first('nl');

    return deserialized;
  }
}
