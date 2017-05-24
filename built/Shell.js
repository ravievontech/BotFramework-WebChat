"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var Chat_1 = require("./Chat");
var react_redux_1 = require("react-redux");
var ShellContainer = (function (_super) {
    tslib_1.__extends(ShellContainer, _super);
    function ShellContainer(props) {
        return _super.call(this, props) || this;
    }
    ShellContainer.prototype.sendMessage = function () {
        if (this.props.inputText.trim().length > 0)
            this.props.sendMessage(this.props.inputText);
    };
    ShellContainer.prototype.onKeyPress = function (e) {
        if (e.key === 'Enter')
            this.sendMessage();
    };
    ShellContainer.prototype.onClickSend = function () {
        this.textInput.focus();
        this.sendMessage();
    };
    ShellContainer.prototype.onChangeFile = function () {
        this.textInput.focus();
        this.props.sendFiles(this.fileInput.files);
        this.fileInput.value = null;
    };
    ShellContainer.prototype.render = function () {
        var _this = this;
        var className = 'wc-console';
        if (this.props.inputText.length > 0)
            className += ' has-text';
        return (React.createElement("div", { className: className },
            React.createElement("input", { id: "wc-upload-input", type: "file", ref: function (input) { return _this.fileInput = input; }, multiple: true, onChange: function () { return _this.onChangeFile(); } }),
            React.createElement("label", { className: "wc-upload", htmlFor: "wc-upload-input" },
                React.createElement("svg", null,
                    React.createElement("path", { d: "M19.96 4.79m-2 0a2 2 0 0 1 4 0 2 2 0 0 1-4 0zM8.32 4.19L2.5 15.53 22.45 15.53 17.46 8.56 14.42 11.18 8.32 4.19ZM1.04 1L1.04 17 24.96 17 24.96 1 1.04 1ZM1.03 0L24.96 0C25.54 0 26 0.45 26 0.99L26 17.01C26 17.55 25.53 18 24.96 18L1.03 18C0.46 18 0 17.55 0 17.01L0 0.99C0 0.45 0.47 0 1.03 0Z" }))),
            React.createElement("div", { className: "wc-textbox" },
                React.createElement("input", { type: "text", className: "wc-shellinput", ref: function (input) { return _this.textInput = input; }, autoFocus: true, value: this.props.inputText, onChange: function (_) { return _this.props.onChangeText(_this.textInput.value); }, onKeyPress: function (e) { return _this.onKeyPress(e); }, placeholder: this.props.strings.consolePlaceholder })),
            React.createElement("label", { className: "wc-send", onClick: function () { return _this.onClickSend(); } },
                React.createElement("svg", null,
                    React.createElement("path", { d: "M26.79 9.38A0.31 0.31 0 0 0 26.79 8.79L0.41 0.02C0.36 0 0.34 0 0.32 0 0.14 0 0 0.13 0 0.29 0 0.33 0.01 0.37 0.03 0.41L3.44 9.08 0.03 17.76A0.29 0.29 0 0 0 0.01 17.8 0.28 0.28 0 0 0 0.01 17.86C0.01 18.02 0.14 18.16 0.3 18.16A0.3 0.3 0 0 0 0.41 18.14L26.79 9.38ZM0.81 0.79L24.84 8.79 3.98 8.79 0.81 0.79ZM3.98 9.37L24.84 9.37 0.81 17.37 3.98 9.37Z" })))));
    };
    return ShellContainer;
}(React.Component));
exports.Shell = react_redux_1.connect(function (state) { return ({
    // passed down to ShellContainer
    inputText: state.shell.input,
    strings: state.format.strings,
    // only used to create helper functions below
    locale: state.format.locale,
    user: state.connection.user,
}); }, {
    // passed down to ShellContainer
    onChangeText: function (input) { return ({ type: 'Update_Input', input: input }); },
    // only used to create helper functions below
    sendMessage: Chat_1.sendMessage,
    sendFiles: Chat_1.sendFiles
}, function (stateProps, dispatchProps, ownProps) { return ({
    // from stateProps
    inputText: stateProps.inputText,
    strings: stateProps.strings,
    // from dispatchProps
    onChangeText: dispatchProps.onChangeText,
    // helper functions
    sendMessage: function (text) { return dispatchProps.sendMessage(text, stateProps.user, stateProps.locale); },
    sendFiles: function (files) { return dispatchProps.sendFiles(files, stateProps.user, stateProps.locale); }
}); })(ShellContainer);
//# sourceMappingURL=Shell.js.map