'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cloneSuite = function cloneSuite(suite) {
	var clone = suite.clone();

	clone.tests = suite.tests.map(function (test) {
		return test.clone();
	});

	clone._beforeAll = suite._beforeAll.map(function (hook) {
		return (0, _create2.default)(hook);
	});
	clone._beforeEach = suite._beforeEach.map(function (hook) {
		return (0, _create2.default)(hook);
	});
	clone._afterAll = suite._afterAll.map(function (hook) {
		return (0, _create2.default)(hook);
	});
	clone._afterEach = suite._afterEach.map(function (hook) {
		return (0, _create2.default)(hook);
	});

	clone.suites = suite.suites.map(cloneSuite);

	return clone;
};

var MochaRunner = function (_Component) {
	(0, _inherits3.default)(MochaRunner, _Component);

	function MochaRunner() {
		(0, _classCallCheck3.default)(this, MochaRunner);
		return (0, _possibleConstructorReturn3.default)(this, (MochaRunner.__proto__ || (0, _getPrototypeOf2.default)(MochaRunner)).apply(this, arguments));
	}

	(0, _createClass3.default)(MochaRunner, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var channel = _storybookAddons2.default.getChannel();
			var rootSuite = window.mocha.suite;

			var _props = this.props,
			    info = _props.info,
			    suites = _props.suites;

			var storyName = [info.kind, info.story].join(' ');

			rootSuite.suites = [];
			rootSuite.addSuite(cloneSuite(suites[storyName]));

			window.mocha.run().on('end', function () {
				return channel.emit('addon-mocha-runner/test-results', document.getElementById('mocha').innerHTML);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var story = this.props.story;


			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{ id: 'story' },
					story
				),
				_react2.default.createElement('div', { id: 'mocha', style: { display: 'none' } })
			);
		}
	}]);
	return MochaRunner;
}(_react.Component);

exports.default = function () {
	var suitesList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	var suites = suitesList.reduce(function (acc, suite) {
		acc[suite.title] = suite;

		return acc;
	}, {});

	return function (story, info) {
		return _react2.default.createElement(MochaRunner, {
			info: info,
			story: story(),
			suites: suites });
	};
};