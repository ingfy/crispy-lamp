import {find} from "./utils";

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

export function getCodepenLanguageFromStackOverflowClass(classes: string[]): string {    
    var langClass = find(classes, _class => !!find(Object.keys(languageClasses), lang => lang === _class));
    var lang = langClass && languageClasses[langClass];
    
    return lang;
}