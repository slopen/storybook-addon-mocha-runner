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

var cloneHook = function cloneHook(htmlElement) {
	return function (hook) {
		var hookFn = hook.fn.hookFn;

		var fn = hookFn || hook.fn;

		hook.fn = function (done) {
			return fn(done, { attachTo: htmlElement });
		};
		hook.fn.hookFn = fn;

		return (0, _create2.default)(hook);
	};
};

var cloneSuite = function cloneSuite(suite, htmlElement) {
	if (!suite) {
		return console.error('ERROR attempt to clone:', suite);
	}

	var clone = suite.clone();

	clone.tests = suite.tests.map(function (test) {
		return test.clone();
	});

	clone._beforeAll = suite._beforeAll.map(cloneHook(htmlElement));
	clone._beforeEach = suite._beforeEach.map(cloneHook(htmlElement));
	clone._afterAll = suite._afterAll.map(cloneHook(htmlElement));
	clone._afterEach = suite._afterEach.map(cloneHook(htmlElement));

	clone.suites = suite.suites.map(cloneSuite);

	return clone;
};

var MochaRunnerComponent = function (_Component) {
	(0, _inherits3.default)(MochaRunnerComponent, _Component);

	function MochaRunnerComponent() {
		(0, _classCallCheck3.default)(this, MochaRunnerComponent);
		return (0, _possibleConstructorReturn3.default)(this, (MochaRunnerComponent.__proto__ || (0, _getPrototypeOf2.default)(MochaRunnerComponent)).apply(this, arguments));
	}

	(0, _createClass3.default)(MochaRunnerComponent, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.runSuites();
		}
	}, {
		key: 'componenDidUpdate',
		value: function componenDidUpdate() {
			this.runSuites();
		}
	}, {
		key: 'runSuites',
		value: function runSuites() {
			var channel = _storybookAddons2.default.getChannel();
			var rootSuite = window.mocha.suite;

			var _props = this.props,
			    info = _props.info,
			    suites = _props.suites;

			var storyName = info.story;
			var suite = suites[storyName];

			if (suite) {
				rootSuite.suites = [];
				rootSuite.addSuite(cloneSuite(suites[storyName], this.story));

				window.mocha.run().on('end', function () {
					return channel.emit('addon-mocha-runner/test-results', document.getElementById('mocha').innerHTML);
				});
			} else {
				console.error('ERROR suite not found by name:', storyName);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement('div', { id: 'story', ref: function ref(story) {
						return _this2.story = story;
					} }),
				_react2.default.createElement('div', { id: 'mocha', style: { display: 'none' } })
			);
		}
	}]);
	return MochaRunnerComponent;
}(_react.Component);

exports.default = function () {
	var suitesList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	var suites = suitesList.reduce(function (acc, suite) {
		acc[suite.title] = suite;

		return acc;
	}, {});

	return function (story, info) {
		return _react2.default.createElement(MochaRunnerComponent, {
			info: info,
			suites: suites });
	};
};