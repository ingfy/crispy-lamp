//simple.js


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

Array.prototype.slice.call($('pre code')).forEach(element => {
    var pre = element.parentElement;
    var classes = Array.prototype.slice.call(pre.classList);
    var langClass = classes.find(_class => Object.keys(languageClasses).find(lang => lang == _class));
    var lang = langClass && languageClasses[langClass];
    
    if (!lang) return;
    
    var formData = {
        lang: lang,
        code: element.textContent,
        run: "False",
        submit: "Submit"
    };
    
    var form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('target', '_blank');
    form.setAttribute('action', 'http://codepad.org');
    
    Object.keys(formData).forEach(key => {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', formData[key]);
        form.appendChild(input);
    });
    
    var submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', `Open ${lang} snippet in codepad!`);
    form.appendChild(submit);
    
    element.parentElement.parentElement.insertBefore(form, element.parentElement);
});