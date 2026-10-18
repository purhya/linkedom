/**
 * @implements globalThis.HTMLSelectElement
 */
export class HTMLSelectElement extends HTMLElement implements globalThis.HTMLSelectElement {
    get options(): NodeList;
    set disabled(value: any);
    get disabled(): any;
    set name(value: any);
    get name(): any;
    /** Select the first matching option and reflect selection into SSR markup. */
    set value(value: any);
    /** Return the selected value, or an empty string when nothing is selected. */
    get value(): any;
}
import { HTMLElement } from './element.js';
import { NodeList } from '../interface/node-list.js';
