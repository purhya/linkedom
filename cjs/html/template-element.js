'use strict';
const {CONTENT, PRIVATE} = require('../shared/symbols.js');

const {registerHTMLClass} = require('../shared/register-html-class.js');

const {getInnerHtml, setInnerHtml} = require('../mixin/inner-html.js');

const {HTMLElement} = require('./element.js');

const tagName = 'template';

/**
 * @implements globalThis.HTMLTemplateElement
 */
class HTMLTemplateElement extends HTMLElement {
  constructor(ownerDocument) {
    super(ownerDocument, tagName);
    let content = this.ownerDocument.createDocumentFragment();
    (this[CONTENT] = content)[PRIVATE] = this;
  }

  /** Read markup from the template's content fragment. */
  get innerHTML() {
    return getInnerHtml(this[CONTENT]);
  }

  /** Replace markup in the template's content fragment. */
  set innerHTML(html) {
    setInnerHtml(this[CONTENT], html);
  }

  /** Move parsed children into the template's content fragment. */
  get content() {
    if (this.hasChildNodes() && !this[CONTENT].hasChildNodes()) {
      for (let node of this.childNodes) {
        this[CONTENT].appendChild(node);
      }
    }
    return this[CONTENT];
  }

  /** Copy the content fragment when cloning deeply. */
  cloneNode(deep = false) {
    let cloned = super.cloneNode(deep);

    if (deep) {
      cloned.innerHTML = this.innerHTML;
    }

    return cloned;
  }
}

registerHTMLClass(tagName, HTMLTemplateElement);

exports.HTMLTemplateElement = HTMLTemplateElement;
