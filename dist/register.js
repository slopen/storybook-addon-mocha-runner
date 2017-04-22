'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('mocha/mocha.css');
require('../styles.css');

var MochaRunner = function (_React$Component) {
	(0, _inherits3.default)(MochaRunner, _React$Component);

	function MochaRunner(props) {
		(0, _classCallCheck3.default)(this, MochaRunner);

		var _this = (0, _possibleConstructorReturn3.default)(this, (MochaRunner.__proto__ || (0, _getPrototypeOf2.default)(MochaRunner)).call(this, props));

		_this.onTestResults = function (html) {
			_this.setState({ html: html });
		};

		_this.state = {};
		return _this;
	}

	(0, _createClass3.default)(MochaRunner, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var channel = this.props.channel;


			channel.on('addon-mocha-runner/test-results', this.onTestResults);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			var channel = this.props.channel;


			channel.removeListener('addon-mocha-runner/test-results', this.onTestResults);
		}
	}, {
		key: 'render',
		value: function render() {
			var html = this.state.html;


			return html ? _react2.default.createElement('div', {
				id: 'mocha',
				className: 'addon-mocha-runner',
				dangerouslySetInnerHTML: { __html: html } }) : null;
		}
	}]);
	return MochaRunner;
}(_react2.default.Component);

_storybookAddons2.default.register('addon-mocha-runner', function (api) {
	return _storybookAddons2.default.addPanel('addon-mocha-runner/notes/panel', {
		title: 'Mocha Runner',
		render: function render() {
			return _react2.default.createElement(MochaRunner, {
				api: api,
				channel: _storybookAddons2.default.getChannel() });
		}
	});
});