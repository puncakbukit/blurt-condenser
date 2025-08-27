"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = reactForm;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
    @arg {string} name - form state will appear in this.state[name]
    @arg {object} instance - `this` for the component
    @arg {array} fields - ['username', 'save', ...]
    @arg {object} initialValues required for checkboxes {save: false, ...}
    @arg {function} validation - values => ({ username: ! values.username ? 'Required' : null, ... })
*/
function reactForm(_ref) {
  var name = _ref.name,
    instance = _ref.instance,
    fields = _ref.fields,
    initialValues = _ref.initialValues,
    _ref$validation = _ref.validation,
    validation = _ref$validation === void 0 ? function () {} : _ref$validation;
  if ((0, _typeof2["default"])(instance) !== 'object') {
    throw new TypeError('instance is a required object');
  }
  if (!Array.isArray(fields)) {
    throw new TypeError('fields is a required array');
  }
  if ((0, _typeof2["default"])(initialValues) !== 'object') {
    throw new TypeError('initialValues is a required object');
  }

  // Give API users access to this.props, this.state, this.etc..
  validation = validation.bind(instance);
  var formState = instance.state = instance.state || {};
  formState[name] = {
    // validate: () => setFormState(instance, fields, validation),
    handleSubmit: function handleSubmit(submitCallback) {
      return function (event) {
        event.preventDefault();
        var _setFormState = setFormState(name, instance, fields, validation),
          valid = _setFormState.valid;
        if (!valid) return;
        var data = getData(fields, instance.state);
        var formValid = true;
        var fs = instance.state[name] || {};
        fs.submitting = true;

        // User can call this function upon successful submission
        var updateInitialValues = function updateInitialValues() {
          setInitialValuesFromForm(name, instance, fields, initialValues);
          formState[name].resetForm();
        };
        instance.setState((0, _defineProperty2["default"])({}, name, fs), function () {
          // TODO, support promise ret
          var ret = submitCallback({
            data: data,
            event: event,
            updateInitialValues: updateInitialValues
          }) || {};
          // Look for field level errors
          for (var _i = 0, _Object$keys = Object.keys(ret); _i < _Object$keys.length; _i++) {
            var fieldName = _Object$keys[_i];
            var error = ret[fieldName];
            if (!error) continue;
            var value = instance.state[fieldName] || {};
            value.error = error;
            value.touched = true;
            if (error) formValid = false;
            instance.setState((0, _defineProperty2["default"])({}, fieldName, value));
          }
          fs.submitting = false;
          fs.valid = formValid;
          instance.setState((0, _defineProperty2["default"])({}, name, fs));
        });
      };
    },
    resetForm: function resetForm() {
      var _iterator = _createForOfIteratorHelper(fields),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var field = _step.value;
          var fieldName = n(field);
          var f = instance.state[fieldName];
          var def = initialValues[fieldName];
          f.props.onChange(def);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    },
    clearForm: function clearForm() {
      var _iterator2 = _createForOfIteratorHelper(fields),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var field = _step2.value;
          var fieldName = n(field);
          var f = instance.state[fieldName];
          f.props.onChange();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  };
  var _iterator3 = _createForOfIteratorHelper(fields),
    _step3;
  try {
    var _loop = function _loop() {
      var field = _step3.value;
      var fieldName = n(field);
      var fieldType = t(field);
      var fs = formState[fieldName] = {
        value: null,
        error: null,
        touched: false
      };

      // Caution: fs.props is expanded <input {...fieldName.props} />, so only add valid props for the component
      fs.props = {
        name: fieldName
      };
      {
        var initialValue = initialValues[fieldName];
        if (fieldType === 'checked') {
          fs.value = toString(initialValue);
          fs.props.checked = toBoolean(initialValue);
        } else if (fieldType === 'selected') {
          fs.props.selected = toString(initialValue);
          fs.value = fs.props.selected;
        } else {
          fs.props.value = toString(initialValue);
          fs.value = fs.props.value;
        }
      }
      fs.props.onChange = function (e) {
        var value = e && e.target ? e.target.value : e; // API may pass value directly
        var v = _objectSpread({}, instance.state[fieldName] || {});
        var initialValue = initialValues[fieldName];
        if (fieldType === 'checked') {
          v.touched = toString(value) !== toString(initialValue);
          v.value = v.props.checked = toBoolean(value);
          v.value = value;
        } else if (fieldType === 'selected') {
          v.touched = toString(value) !== toString(initialValue);
          v.value = v.props.selected = toString(value);
        } else {
          v.touched = toString(value) !== toString(initialValue);
          v.value = v.props.value = toString(value);
        }
        instance.setState((0, _defineProperty2["default"])({}, fieldName, v), function () {
          setFormState(name, instance, fields, validation);
        });
      };
      fs.props.onBlur = function () {
        // Some errors are better shown only after blur === true
        var v = _objectSpread({}, instance.state[fieldName] || {});
        v.blur = true;
        instance.setState((0, _defineProperty2["default"])({}, fieldName, v));
      };
    };
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}
function setFormState(name, instance, fields, validation) {
  var formValid = true;
  var formTouched = false;
  var v = validation(getData(fields, instance.state));
  var _iterator4 = _createForOfIteratorHelper(fields),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var field = _step4.value;
      var fieldName = n(field);
      var validate = v[fieldName];
      var error = validate || null;
      var value = _objectSpread({}, instance.state[fieldName] || {});
      value.error = error;
      formTouched = formTouched || value.touched;
      if (error) formValid = false;
      instance.setState((0, _defineProperty2["default"])({}, fieldName, value));
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  var fs = _objectSpread({}, instance.state[name] || {});
  fs.valid = formValid;
  fs.touched = formTouched;
  instance.setState((0, _defineProperty2["default"])({}, name, fs));
  return fs;
}
function setInitialValuesFromForm(name, instance, fields, initialValues) {
  var data = getData(fields, instance.state);
  var _iterator5 = _createForOfIteratorHelper(fields),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var field = _step5.value;
      var fieldName = n(field);
      initialValues[fieldName] = data[fieldName];
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
}
function getData(fields, state) {
  var data = {};
  var _iterator6 = _createForOfIteratorHelper(fields),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var field = _step6.value;
      var fieldName = n(field);
      data[fieldName] = state[fieldName].value;
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  return data;
}

/*
    @arg {string} field - field:type
    <pre>
        type = checked (for checkbox or radio)
        type = selected (for seelct option)
        type = string
    </pre>
    @return {string} type
*/
function t(field) {
  var _field$split = field.split(':'),
    _field$split2 = (0, _slicedToArray2["default"])(_field$split, 2),
    _field$split2$ = _field$split2[1],
    type = _field$split2$ === void 0 ? 'string' : _field$split2$;
  return type;
}

/**
    @return {string} name
*/
function n(field) {
  var _field$split3 = field.split(':'),
    _field$split4 = (0, _slicedToArray2["default"])(_field$split3, 1),
    name = _field$split4[0];
  return name;
}
var hasValue = function hasValue(v) {
  return v == null ? false : (typeof v === 'string' ? v.trim() : v) !== '';
};
var toString = function toString(v) {
  return hasValue(v) ? v : '';
};
var toBoolean = function toBoolean(v) {
  return hasValue(v) ? JSON.parse(v) : '';
};