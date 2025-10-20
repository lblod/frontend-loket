// Same interface as LangString from https://github.com/mu-semtech/ember-mu-transform-helpers/blob/82196cf20f670d46f8abcf7385515a412d057bbd/addon/transforms/language-string.js#L5-L11
// But implemented as class to avoid context problem with actions (component "this" context may no longer exist when passed on to parent)

class LangString {
  constructor(content, lang) {
    this.content = content;
    this.language = lang;
  }

  toString() {
    return `${this['content']} (${this['language']})`;
  }
}

// keep same interface as in addon transform (no "new" needed for contructor)
const LangStringFunc = function () {
  return new LangString(...arguments);
};

export default LangStringFunc;
