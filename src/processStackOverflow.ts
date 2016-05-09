import {find, nodeListToArray, toArray} from './utils';
import {getCodepenLanguageFromStackOverflowClass as getLanguage} from './language';
import {createCodepenForm} from './dom';

export function addOpenButton(codeElement: Element) {
    var pre = codeElement.parentElement;
    var lang = getLanguage(toArray(pre.classList));

    if (!lang) return;

    var pre = codeElement.parentElement;

    pre.parentElement.insertBefore(createCodepenForm(lang, codeElement.textContent), pre);
}

export function main() {
    var codes = nodeListToArray(document.querySelectorAll('pre code'));

    codes.forEach(addOpenButton);
}