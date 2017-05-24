"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MarkdownIt = require("markdown-it");
var React = require("react");
exports.FormattedText = function (props) {
    if (!props.text || props.text === '')
        return null;
    switch (props.format) {
        case "plain":
            return renderPlainText(props.text);
        default:
            return renderMarkdown(props.text, props.onImageLoad);
    }
};
var renderPlainText = function (text) {
    var lines = text.replace('\r', '').split('\n');
    var elements = lines.map(function (line, i) { return React.createElement("span", { key: i },
        line,
        React.createElement("br", null)); });
    return React.createElement("span", { className: "format-plain" }, elements);
};
var markdownIt = new MarkdownIt({ html: true, linkify: true, typographer: true });
var renderMarkdown = function (text, onImageLoad) {
    var src = text.replace(/<br\s*\/?>/ig, '\r\n\r\n');
    var __html = markdownIt.render(src);
    return React.createElement("div", { className: "format-markdown", dangerouslySetInnerHTML: { __html: __html } });
};
//# sourceMappingURL=FormattedText.js.map