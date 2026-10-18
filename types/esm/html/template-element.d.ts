/**
 * @implements globalThis.HTMLTemplateElement
 */
export class HTMLTemplateElement extends HTMLElement implements globalThis.HTMLTemplateElement {
    constructor(ownerDocument: any);
    /** Move parsed children into the template's content fragment. */
    get content(): any;
    [CONTENT]: any;
}
import { HTMLElement } from './element.js';
import { CONTENT } from '../shared/symbols.js';
