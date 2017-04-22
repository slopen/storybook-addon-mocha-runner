import {configure} from '@kadira/storybook';
import 'mocha/mocha';

function loadStories () {
    require('../src/stories');
}

window.mocha.setup ('bdd');

global.beforeEach = window.Mocha.beforeEach;
global.describe = window.Mocha.describe;
global.it = window.Mocha.it;

configure (loadStories, module);
