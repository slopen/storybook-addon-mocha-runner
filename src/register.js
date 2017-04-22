import React from 'react';
import addons from '@kadira/storybook-addons';

require ('mocha/mocha.css');
require ('../styles.css');

class MochaRunner extends React.Component {

	constructor (props) {
		super (props);

		this.state = {};
	}

	componentDidMount () {
		const {channel} = this.props;

		channel.on ('addon-mocha-runner/test-results', this.onTestResults);
	}

	componentWillUnmount () {
		const {channel} = this.props;

		channel.removeListener ('addon-mocha-runner/test-results', this.onTestResults);
	}

	onTestResults = (html) => {
		this.setState ({html});
	}

	render () {
		const {html} = this.state;

		return html ? (
			<div
				id="mocha"
				className="addon-mocha-runner"
				dangerouslySetInnerHTML={{__html: html}}/>
		) : null;
	}
}

addons.register ('addon-mocha-runner', (api) =>
	addons.addPanel ('addon-mocha-runner/notes/panel', {
		title: 'Mocha Runner',
		render: () => (
			<MochaRunner
				api={api}
				channel={addons.getChannel ()}/>
		)
	})
);