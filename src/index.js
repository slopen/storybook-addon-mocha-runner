import React, {Component} from 'react';
import addons from '@kadira/storybook-addons';

const cloneSuite = (suite) => {
	const clone = suite.clone ();

	clone.tests = suite.tests.map ((test) => test.clone ());

	clone._beforeAll = suite._beforeAll.map ((hook) => Object.create (hook));
	clone._beforeEach = suite._beforeEach.map ((hook) => Object.create (hook));
	clone._afterAll = suite._afterAll.map ((hook) => Object.create (hook));
	clone._afterEach = suite._afterEach.map ((hook) => Object.create (hook));

	clone.suites = suite.suites.map (cloneSuite);

	return clone;
}


class MochaRunner extends Component {
	componentDidMount () {
		const channel = addons.getChannel ();
		const rootSuite = window.mocha.suite;

		const {info, suites} = this.props;
		const storyName = [info.kind, info.story].join (' ');

		rootSuite.suites = []
		rootSuite.addSuite (cloneSuite (suites [storyName]));

		window.mocha
			.run ()
			.on ('end', () => channel.emit (
				'addon-mocha-runner/test-results',
				document.getElementById ('mocha').innerHTML
			));
	}

	render () {
		const {story} = this.props;

		return (
			<div>
				<div id="story">{story}</div>
				<div id="mocha" style={{display: 'none'}}></div>
			</div>
		);
	}
}


export default (suitesList = []) => {
	const suites = suitesList.reduce ((acc, suite) => {
		acc [suite.title] = suite;

		return acc;
	}, {});

	return (story, info) => (
		<MochaRunner
			info={info}
			story={story ()}
			suites={suites}/>
	);
}
