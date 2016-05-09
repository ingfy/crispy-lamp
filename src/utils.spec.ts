import {expect} from 'chai';

import * as utils from './utils';

describe('utils', () => {
    describe('find()', () => {
        it('should return null for an empty list', () => {
            expect(utils.find([], () => true)).to.be.null;
        });
        
        it('should return the first match', () => {
            expect(utils.find([1, 2], () => true)).to.equal(1);
        });
    });
});