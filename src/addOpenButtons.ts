import {createElement, find, nodeListToArray, toArray} from './utils';

var languageClasses = {
    'lang-php': 'PHP',
    'lang-py': 'Python',
    'lang-cpp': 'C++',
    'lang-c': 'C',
    'lang-d': 'D',
    'lang-perl': 'Prel',
    'lang-scheme': 'Scheme',
    'lang-lua': 'Lua',
    'lang-haskell': 'Haskell',
    'lang-ocaml': 'Ocaml'
};

function main() {
    var codes = nodeListToArray(document.querySelectorAll('pre code'));

    for (var code of codes) {
        var pre = code.parentElement;
        var classes = toArray(pre.classList);
        var langClass = find(classes, _class => !!find(Object.keys(languageClasses), lang => lang === _class));
        var lang = langClass && languageClasses[langClass];

        if (!lang) return;

        var form = createElement('form', {
            'method': 'POST',
            'target': '_blank',
            'action': 'http://codepad.org'
        });

        var formData = {
            lang: lang,
            code: code.textContent,
            run: "False",
            submit: "Submit"
        };

        for (var key in formData) {
            form.appendChild(createElement('input', {
                'type': 'hidden',
                'name': key,
                'value': formData[key]
            }));
        }

        var submit = createElement('input', {
            'type': 'submit',
            'value': `Open ${lang} snippet in codepad!`
        });

        var pre = code.parentElement;

        pre.parentElement.insertBefore(form, pre);
    }
}

main();