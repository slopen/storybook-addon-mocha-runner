import React, {Component} from 'react';
import addons from '@kadira/storybook-addons';

const cloneHook = (htmlElement) => (hook) => {
	const {hookFn} = hook.fn;
	const fn = hookFn || hook.fn;

	hook.fn = (done) => fn (done, {attachTo: htmlElement});
	hook.fn.hookFn = fn;

	return Object.create (hook);
}

const cloneSuite = (suite, htmlElement) => {
	if (!suite) {
		return console.error ('ERROR attempt to clone:', suite);
	}

	const clone = suite.clone ();

	clone.tests = suite.tests.map ((test) => test.clone ());

	clone._beforeAll = suite._beforeAll.map (cloneHook (htmlElement));
	clone._beforeEach = suite._beforeEach.map (cloneHook (htmlElement));
	clone._afterAll = suite._afterAll.map (cloneHook (htmlElement));
	clone._afterEach = suite._afterEach.map (cloneHook (htmlElement));

	clone.suites = suite.suites.map (cloneSuite);

	return clone;
}


class MochaRunnerComponent extends Component {
	componentDidMount () {
		this.runSuites ();
	}

	componenDidUpdate () {
		this.runSuites ();
	}

	runSuites () {
		const channel = addons.getChannel ();
		const rootSuite = window.mocha.suite;

		const {info, suites} = this.props;
		const storyName = info.story;
		const suite = suites [storyName];

		if (suite) {
			rootSuite.suites = [];
			rootSuite.addSuite (
				cloneSuite (suites [storyName], this.story)
			);

			window.mocha
				.run ()
				.on ('end', () => channel.emit (
					'addon-mocha-runner/test-results',
					document.getElementById ('mocha').innerHTML
				));

		} else {
			console.error ('ERROR suite not found by name:', storyName);
		}
	}

	render () {
		return (
			<div>
				<div id="story" ref={(story) => this.story = story}/>
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
		<MochaRunnerComponent
			info={info}
			suites={suites}/>
	);
}
