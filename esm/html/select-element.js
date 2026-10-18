import {registerHTMLClass} from '../shared/register-html-class.js';
import {booleanAttribute} from '../shared/attributes.js';

import {HTMLElement} from './element.js';
import {NodeList} from '../interface/node-list.js';

const tagName = 'select';

/**
 * @implements globalThis.HTMLSelectElement
 */
class HTMLSelectElement extends HTMLElement {
  constructor(ownerDocument, localName = tagName) {
    super(ownerDocument, localName);
  }

  get options() {
    let children = new NodeList;
    let {firstElementChild} = this;
    while (firstElementChild) {
      if (firstElementChild.tagName === 'OPTGROUP')
        children.push(...firstElementChild.children);
      else
        children.push(firstElementChild);
      firstElementChild = firstElementChild.nextElementSibling;
    }
    return children;
  }

  /* c8 ignore start */
  get disabled() { return booleanAttribute.get(this, 'disabled'); }
  set disabled(value) { booleanAttribute.set(this, 'disabled', value); }

  get name() { return this.getAttribute('name'); }
  set name(value) { this.setAttribute('name', value); }
  /* c8 ignore stop */

  /** Return the selected value, or an empty string when nothing is selected. */
  get value() { return this.querySelector('option[selected]')?.value ?? ''; }

  /** Select the first matching option and reflect selection into SSR markup. */
  set value(value) {
    let matched = false;
    value = String(value);

    for (let option of this.querySelectorAll('option')) {
      let selected = !matched && option.value === value;
      booleanAttribute.set(option, 'selected', selected);
      matched = matched || selected;
    }
  }
}

registerHTMLClass(tagName, HTMLSelectElement);

export {HTMLSelectElement};

