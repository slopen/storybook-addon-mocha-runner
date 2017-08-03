import React, {Component} from 'react';
import addons from '@kadira/storybook-addons';
import debounce from 'lodash.debounce';

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

const runMocha = (suite, story, channel) => {
	const rootSuite = window.mocha.suite;

	rootSuite.suites = [];
	rootSuite.addSuite (
		cloneSuite (suite, story)
	);

	document.getElementById ('mocha').innerHTML = '';

	window.mocha
		.run ()
		.on ('end', () => channel.emit (
			'addon-mocha-runner/test-results',
			document.getElementById ('mocha').innerHTML
		));
}



class MochaRunnerComponent extends Component {
	componentWillUnmount () {
		this._umounted = true;
	}

	componentDidMount () {
		this._umounted = false;
		this.runSuites ();
	}

	componentDidUpdate () {
		this.runSuites ();
	}

	runSuites = debounce (() => {
		if (this._umounted) {
			return;
		}

		const channel = addons.getChannel ();

		const {info, suites} = this.props;
		const storyName = info.story;
		const suite = suites [storyName];

		if (suite) {
			runMocha (suite, this.story, channel);
		} else {
			console.error ('ERROR suite not found by name:', storyName);
		}
	}, 50)

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
