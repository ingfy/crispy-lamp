import {expect} from 'chai';

import * as language from './language';

describe('language', () => {
    describe('getCodepenLanguageFromStackOverflowClass', () => {
        it('should return null value when no language is found', () => {
            expect(language.getCodepenLanguageFromStackOverflowClass(["lang-unknown"])).to.be.null;
        });
        
        it('should find the language no matter the order of classes', () => {
            let input = ["dummy-class", "lang-cpp"];
            let output = language.getCodepenLanguageFromStackOverflowClass(input);
            expect(output).to.equal("C++");
        });
    });
});