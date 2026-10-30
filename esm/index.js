import './dom-environment.js';
import {DOMParser} from './dom/parser.js';
import {Document as _Document} from './interface/document.js';

import {illegalConstructor} from './shared/facades.js';
import {setPrototypeOf} from './shared/object.js';
export {parseJSON, toJSON} from './shared/parse-json.js';

export * from './shared/facades.js';
export * from './shared/html-classes.js';

export {DOMParser};

export {CustomEvent} from './interface/custom-event.js';
export {Event} from './interface/event.js';
export {EventTarget} from './interface/event-target.js';
export {InputEvent} from './interface/input-event.js';
export {NodeList} from './interface/node-list.js';
export {NodeFilter} from './interface/node-filter.js';

export const parseHTML = (html, globals = null) => {
  let win = (new DOMParser).parseFromString(html, 'text/html', globals).defaultView;
  globalThis.window = win;
  globalThis.document = win.document;
  if (globalThis.navigator) {
    Object.defineProperty(win, 'navigator', {value: win.navigator, configurable: true});
  }
  else {
    globalThis.navigator = win.navigator;
  }
  globalThis.customElements = win.customElements;
  globalThis.HTMLElement = win.HTMLElement;
  globalThis.Element = win.Element;
  globalThis.Node = win.Node;
  return win;
};

export function Document() {
  illegalConstructor();
}

setPrototypeOf(Document, _Document).prototype = _Document.prototype;
