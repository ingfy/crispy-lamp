import {expect} from 'chai';

import * as processStackOverflow from './processStackOverflow';

describe('processStackOverflow', () => {
    describe('addOpenButton', () => {
        var dummyPost;
        
        beforeEach(() => {
            dummyPost = document.createElement('div');
            dummyPost.innerHTML = `<div class="post-text" itemprop="text">

<p>I want to know how to add to the expression where the variable is in the array for example:</p>

<pre class="lang-py prettyprint prettyprinted"><code><span class="pln">number </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="pln"> </span><span class="lit">1</span><span class="pun">,</span><span class="pln"> </span><span class="lit">2</span><span class="pun">,</span><span class="pln"> </span><span class="lit">3</span><span class="pun">,</span><span class="pln"> </span><span class="lit">4</span><span class="pun">,</span><span class="pln"> </span><span class="lit">5</span><span class="pln"> </span><span class="pun">]</span><span class="pln">
r </span><span class="pun">=</span><span class="pln"> </span><span class="lit">0</span><span class="pln">

</span><span class="kwd">print</span><span class="pun">(</span><span class="pln">number</span><span class="pun">[</span><span class="pln">r</span><span class="pun">])</span></code></pre>

<p>Simple.</p>

<p>But I want to print (number[1]) but using the r, not numbers, so how would I write it. I have tried (number[r+1]) multiple times. In addition to this, i have also tried other versions, however they don't work. Can someone help please?</p>
    </div>`;
        });
        
        it('should add a single form element to the post', () => {
            processStackOverflow.addOpenButton(dummyPost.querySelector('pre code'));
            expect(dummyPost.querySelectorAll('form').length).to.equal(1);
        });
    });
});