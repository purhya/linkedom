const assert = require('../assert.js').for('Local package modifications');

const {parseHTML, DOMParser} = global[Symbol.for('linkedom')];


/** Verify the custom serialization and template behavior kept from 0.18.12. */
function testLocalModifications() {
  let {document} = parseHTML('');
  let element = document.createElement('div');
  element.setAttribute('data-empty', '');
  element.setAttribute('data-value', 'value');
  assert(element.outerHTML, '<div data-value="value" data-empty></div>');

  let xml = new DOMParser().parseFromString('<node data-empty=""/>', 'text/xml');
  assert(xml.documentElement.outerHTML, '<node data-empty="" />');

  element.style.color = 'red';
  element.style.backgroundColor = 'blue';
  element.style.color = '';
  assert(element.style.cssText, 'background-color:blue');
  assert(element.style.color, '');
  element.style.backgroundColor = '';
  assert(element.style.cssText, '');
  assert(element.outerHTML, '<div data-value="value" data-empty></div>');

  let template = document.createElement('template');
  template.innerHTML = '<p>content</p>';
  assert(template.childNodes.length, 0);
  assert(template.content.firstChild.outerHTML, '<p>content</p>');
  assert(template.innerHTML, '<p>content</p>');

  let cloned = template.cloneNode(true);
  assert(cloned.innerHTML, '<p>content</p>');
  assert(cloned.content.firstChild === template.content.firstChild, false);
  assert(template.cloneNode(false).content.childNodes.length, 0);
  cloned.content.firstChild.textContent = 'clone';
  assert(template.innerHTML, '<p>content</p>');

  element.appendChild(template.content);
  assert(template.innerHTML, '');

  let parsed = parseHTML('<template><p>parsed</p></template>').document.documentElement;
  let child = parsed.firstChild;
  assert(parsed.content.firstChild, child, 'content moves the original parsed node');
  assert(parsed.childNodes.length, 0);
  assert(parsed.innerHTML, '<p>parsed</p>');

  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.innerHTML = '<linearGradient id="a"/><path d="M0 0"/>';
  assert(svg.childNodes.length, 2, 'self-closing SVG markup keeps siblings');
  assert(svg.firstChild.localName, 'linearGradient', 'SVG parsing preserves case');
  assert(svg.lastChild.localName, 'path');
  assert(svg.firstChild.ownerDocument, document);
}


testLocalModifications();
