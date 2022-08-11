import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfFormFieldsRichTextEditorComponent extends SimpleInputFieldComponent {
  editor;
  inputId = 'richtext-' + guidFor(this);

  constructor() {
    super(...arguments);

    // The editor returns an empty string if it contains no content, so we default to that as well.
    this.value = '';
  }

  get editorOptions() {
    return {
      showToggleRdfaAnnotations: false,
      showInsertButton: false,
      showRdfa: false,
      showRdfaHighlight: false,
      showRdfaHover: false,
      showPaper: false,
      showSidebar: false,
    };
  }

  get toolbarOptions() {
    return {
      showTextStyleButtons: true,
      showListButtons: true,
      showIndentButtons: true,
    };
  }

  @action
  handleRdfaEditorInit(editor) {
    this.editor = editor;

    // We only set the value if it contains actual content. This prevents the browser from focusing the editor field due to the content update.
    if (this.value) {
      editor.setHtmlContent(this.value);
    }
  }

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    //rdfaEditor setup is async, updateValue may be called before it is set
    if (this.editor) {
      const editorValue = this.editor.htmlContent;

      // Only trigger an update if the value actually changed.
      // This prevents that the form observer is triggered even though no editor content was changed.
      if (this.value !== editorValue) {
        super.updateValue(editorValue);
      }
    }
  }
}
