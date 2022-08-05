import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfFormFieldsRichTextEditorComponent extends SimpleInputFieldComponent {
  editor;
  inputId = 'richtext-' + guidFor(this);
  firstRun = true;
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
    editor.setHtmlContent(this.value ? this.value : '');
  }

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    //rdfaEditor setup is async, updateValue may be called before it is set
    if (this.editor) {
      const editorValue = this.editor.htmlContent;
      if(!this.firstRun){
        super.updateValue(editorValue);
      }
      this.firstRun = false;
    }
  }
}
