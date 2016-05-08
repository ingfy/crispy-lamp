/// <reference path="../typings/main.d.ts" />

import chai = require('chai');

import {createElement} from './utils';

describe('utils', () => {
   describe('createElement', () => {
       it('should return a bare element when given no attributes', () => {
           chai.expect(createElement('p').getAttribute('class')).to.equal(null);
       });
   });
});