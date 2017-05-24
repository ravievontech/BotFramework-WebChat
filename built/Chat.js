"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var botframework_directlinejs_1 = require("botframework-directlinejs");
var Store_1 = require("./Store");
var react_redux_1 = require("react-redux");
exports.sendMessage = function (text, from, locale) { return ({
    type: 'Send_Message',
    activity: {
        type: "message",
        text: text,
        from: from,
        locale: locale,
        textFormat: 'plain',
        timestamp: (new Date()).toISOString()
    }
}); };
exports.sendFiles = function (files, from, locale) { return ({
    type: 'Send_Message',
    activity: {
        type: "message",
        attachments: attachmentsFromFiles(files),
        from: from,
        locale: locale
    }
}); };
var History_1 = require("./History");
var MessagePane_1 = require("./MessagePane");
var Shell_1 = require("./Shell");
var Chat = (function (_super) {
    tslib_1.__extends(Chat, _super);
    function Chat(props) {
        var _this = _super.call(this, props) || this;
        _this.store = Store_1.createStore();
        _this.resizeListener = function () { return _this.setSize(); };
        exports.konsole.log("BotChat.Chat props", props);
        _this.store.dispatch({
            type: 'Set_Locale',
            locale: props.locale || window.navigator["userLanguage"] || window.navigator.language || 'en'
        });
        if (props.formatOptions)
            _this.store.dispatch({ type: 'Set_Format_Options', options: props.formatOptions });
        if (props.sendTyping)
            _this.store.dispatch({ type: 'Set_Send_Typing', sendTyping: props.sendTyping });
        return _this;
    }
    Chat.prototype.handleIncomingActivity = function (activity) {
        var state = this.store.getState();
        switch (activity.type) {
            case "message":
                this.store.dispatch({ type: activity.from.id === state.connection.user.id ? 'Receive_Sent_Message' : 'Receive_Message', activity: activity });
                break;
            case "typing":
                if (activity.from.id !== state.connection.user.id)
                    this.store.dispatch({ type: 'Show_Typing', activity: activity });
                break;
        }
    };
    Chat.prototype.setSize = function () {
        this.store.dispatch({
            type: 'Set_Size',
            width: this.chatviewPanel.offsetWidth,
            height: this.chatviewPanel.offsetHeight
        });
    };
    Chat.prototype.resetMessage = function () {
        var state = this.store.getState();
        this.store.dispatch(exports.sendMessage('restart', state.connection.user, "en-GB"));
    };
    Chat.prototype.componentDidMount = function () {
        var _this = this;
        // Now that we're mounted, we know our dimensions. Put them in the store (this will force a re-render)
        this.setSize();
        var botConnection = this.props.directLine
            ? (this.botConnection = new botframework_directlinejs_1.DirectLine(this.props.directLine))
            : this.props.botConnection;
        if (this.props.resize === 'window')
            window.addEventListener('resize', this.resizeListener);
        this.store.dispatch({ type: 'Start_Connection', user: this.props.user, bot: this.props.bot, botConnection: botConnection, selectedActivity: this.props.selectedActivity });
        this.connectionStatusSubscription = botConnection.connectionStatus$.subscribe(function (connectionStatus) {
            return _this.store.dispatch({ type: 'Connection_Change', connectionStatus: connectionStatus });
        });
        this.activitySubscription = botConnection.activity$.subscribe(function (activity) { return _this.handleIncomingActivity(activity); }, function (error) { return exports.konsole.log("activity$ error", error); });
        if (this.props.selectedActivity) {
            this.selectedActivitySubscription = this.props.selectedActivity.subscribe(function (activityOrID) {
                _this.store.dispatch({
                    type: 'Select_Activity',
                    selectedActivity: activityOrID.activity || _this.store.getState().history.activities.find(function (activity) { return activity.id === activityOrID.id; })
                });
            });
        }
    };
    Chat.prototype.componentWillUnmount = function () {
        this.connectionStatusSubscription.unsubscribe();
        this.activitySubscription.unsubscribe();
        if (this.selectedActivitySubscription)
            this.selectedActivitySubscription.unsubscribe();
        if (this.botConnection)
            this.botConnection.end();
        window.removeEventListener('resize', this.resizeListener);
    };
    // At startup we do three render passes:
    // 1. To determine the dimensions of the chat panel (nothing needs to actually render here, so we don't)
    // 2. To determine the margins of any given carousel (we just render one mock activity so that we can measure it)
    // 3. (this is also the normal re-render case) To render without the mock activity
    Chat.prototype.setFocus = function () {
        // HUGE HACK - set focus back to input after clicking on an action
        // React makes this hard to do well, so we just do an end run around them
        this.chatviewPanel.querySelector(".wc-shellinput").focus();
    };
    Chat.prototype.render = function () {
        var _this = this;
        var state = this.store.getState();
        exports.konsole.log("BotChat.Chat state", state);
        // only render real stuff after we know our dimensions
        var header;
        if (state.format.options.showHeader)
            header =
                React.createElement("div", null,
                    React.createElement("img", { className: "refshIcon", src: "assets/images/refresh.png", title: "restart", onClick: function () { return _this.resetMessage(); } }),
                    React.createElement("div", { className: "wc-header" },
                        React.createElement("span", { className: "pull-left" }, state.format.strings.title)));
        var resize;
        if (this.props.resize === 'detect')
            resize =
                React.createElement(ResizeDetector, { onresize: this.resizeListener });
        return (React.createElement(react_redux_1.Provider, { store: this.store },
            React.createElement("div", { className: "wc-chatview-panel", ref: function (div) { return _this.chatviewPanel = div; } },
                header,
                React.createElement(MessagePane_1.MessagePane, { setFocus: function () { return _this.setFocus(); } },
                    React.createElement(History_1.History, { setFocus: function () { return _this.setFocus(); } })),
                React.createElement(Shell_1.Shell, null),
                resize)));
    };
    return Chat;
}(React.Component));
exports.Chat = Chat;
exports.doCardAction = function (botConnection, from, locale, sendMessage) { return function (type, value) {
    switch (type) {
        case "imBack":
            if (value && typeof value === 'string')
                sendMessage(value, from, locale);
            break;
        case "postBack":
            exports.sendPostBack(botConnection, value, from, locale);
            break;
        case "call":
        case "openUrl":
        case "playAudio":
        case "playVideo":
        case "showImage":
        case "downloadFile":
        case "signin":
            window.open(value);
            break;
        default:
            exports.konsole.log("unknown button type", type);
    }
}; };
exports.sendPostBack = function (botConnection, text, from, locale) {
    botConnection.postActivity({
        type: "message",
        text: text,
        from: from,
        locale: locale
    })
        .subscribe(function (id) {
        exports.konsole.log("success sending postBack", id);
    }, function (error) {
        exports.konsole.log("failed to send postBack", error);
    });
};
var attachmentsFromFiles = function (files) {
    var attachments = [];
    for (var i = 0, numFiles = files.length; i < numFiles; i++) {
        var file = files[i];
        attachments.push({
            contentType: file.type,
            contentUrl: window.URL.createObjectURL(file),
            name: file.name
        });
    }
    return attachments;
};
exports.renderIfNonempty = function (value, renderer) {
    if (value !== undefined && value !== null && (typeof value !== 'string' || value.length > 0))
        return renderer(value);
};
exports.classList = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.filter(Boolean).join(' ');
};
exports.konsole = {
    log: function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (typeof (window) !== 'undefined' && window["botchatDebug"] && message)
            console.log.apply(console, [message].concat(optionalParams));
    }
};
// note: container of this element must have CSS position of either absolute or relative
var ResizeDetector = function (props) {
    // adapted to React from https://github.com/developit/simple-element-resize-detector
    return React.createElement("iframe", { style: { position: 'absolute', left: '0', top: '-100%', width: '100%', height: '100%', margin: '1px 0 0', border: 'none', opacity: 0, visibility: 'hidden', pointerEvents: 'none' }, ref: function (frame) {
            if (frame)
                frame.contentWindow.onresize = props.onresize;
        } });
};
//# sourceMappingURL=Chat.js.map