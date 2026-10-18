const assert = require('../assert.js').for('HTMLSelectElement');

const {parseHTML} = global[Symbol.for('linkedom')];

let {document} = parseHTML('<select></select>');
let {firstElementChild: select} = document;

select.innerHTML = '<option></option><option selected value="OK"></option>';
assert(select.toString(), '<select><option></option><option selected value="OK"></option></select>');
assert(select.value, 'OK');
assert(select.options[1].selected, true);
select.options[0].selected = true;
assert(select.toString(), '<select><option selected></option><option value="OK"></option></select>');
select.options[0].selected = true;

({document} = parseHTML('<select><option></option><optgroup><option></option></optgroup></select>'));
({firstElementChild: select} = document);
assert(select.options.toString(), '<option></option>,<option></option>');
assert(select.options.length, 2);

select.innerHTML = '<option selected value="a">A</option><option value="b">B</option>';
select.value = 'b';
assert(select.value, 'b', 'value assignment selects a matching option');
assert(select.options[0].selected, false, 'value assignment clears the old selection');
assert(select.options[1].selected, true);
assert(select.outerHTML, '<select><option value="a">A</option><option selected value="b">B</option></select>', 'selection is serialized for SSR');

let restored = parseHTML(select.outerHTML).document.documentElement;
assert(restored.value, 'b', 'selection survives an SSR HTML round trip');

select.value = 'missing';
assert(select.value, '', 'unmatched values clear selection');
assert(select.querySelectorAll('option[selected]').length, 0);

select.innerHTML = '<option value="">Empty</option><option selected value="1">One</option>';
select.value = '';
assert(select.options[0].selected, true, 'empty values can be selected');
assert(select.options[1].selected, false);
select.value = 1;
assert(select.value, '1', 'assigned values are converted to strings');

select.innerHTML = '<optgroup><option value="same">First</option></optgroup><optgroup><option selected value="same">Second</option></optgroup><option selected value="other">Other</option>';
select.value = 'same';
assert(select.options[0].selected, true, 'grouped options can be selected');
assert(select.options[1].selected, false, 'only the first duplicate value is selected');
assert(select.options[2].selected, false, 'selection is cleared across option groups');

select.setAttribute('multiple', '');
select.options[1].setAttribute('selected', '');
select.options[2].setAttribute('selected', '');
select.value = 'same';
assert(select.querySelectorAll('option[selected]').length, 1, 'value assignment selects one option even with multiple');
assert(select.options[0].selected, true);

select.replaceChildren();
select.value = 'missing';
assert(select.value, '', 'assigning an empty select does not throw');

