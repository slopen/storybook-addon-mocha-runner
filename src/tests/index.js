import {expect} from 'chai';
import {isElement} from 'react-dom/test-utils';

import AddonMochaRunner from '../';

const {describe, it} = global;

export const renderComponent = AddonMochaRunner;

export default describe ('Storybook Mocha Runner default view', () => {

    it ('should have some tests', () => {
        expect (true).equal (true);
    });

    it ('should return a decorator function', () => {
        const decorator = AddonMochaRunner ();

        expect (decorator).to.be.a ('function');
        expect (decorator.length).equal (2);
    });

    it ('should decorator return react element', () => {
        const Element = AddonMochaRunner () (() => null);

        expect (isElement (Element)).equal (true);
    });

});
