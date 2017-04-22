import React from 'react';
import {storiesOf} from '@kadira/storybook';

import AddonMochaRunner from '../';
import test from '../tests';

storiesOf ('Storybook Mocha Runner', module)

    .addDecorator (
        AddonMochaRunner ([
            test
        ])
    )

    .add ('default view', () => {
        return (
            <span>{'test story'}</span>
        );
    });
