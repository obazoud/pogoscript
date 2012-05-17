((function() {
    var self, createIndentStack, createInterpolation;
    self = this;
    createIndentStack = require("./indentStack").createIndentStack;
    createInterpolation = require("./interpolation").createInterpolation;
    exports.createParserContext = createParserContext = function(gen1_options) {
        var terms;
        terms = gen1_options && gen1_options.hasOwnProperty("terms") && gen1_options.terms !== void 0 ? gen1_options.terms : void 0;
        return object(function() {
            var self;
            self = this;
            self.terms = terms;
            self.indentStack = createIndentStack();
            self.tokens = function(tokens) {
                var self;
                self = this;
                self.lexer.tokens = tokens;
                return tokens.shift();
            };
            self.setIndentation = function(text) {
                var self;
                self = this;
                return self.indentStack.setIndentation(text);
            };
            self.unsetIndentation = function(token) {
                var self, tokens;
                self = this;
                tokens = self.indentStack.unsetIndentation();
                tokens.push(token);
                return self.tokens(tokens);
            };
            self.indentation = function(text) {
                var self, tokens;
                self = this;
                tokens = self.indentStack.tokensForNewLine(text);
                return self.tokens(tokens);
            };
            self.eof = function() {
                var self;
                self = this;
                return self.tokens(self.indentStack.tokensForEof());
            };
            self.interpolation = createInterpolation();
            self.lexOperator = function(parserContext, op) {
                var self;
                self = this;
                if (/[?!][.;]/.test(op)) {
                    return parserContext.tokens([ op[0], op[1] ]);
                } else if (/^(=>|\.\.\.|@:|[#@:!?,.=;])$/.test(op)) {
                    return op;
                } else {
                    return "operator";
                }
            };
            self.loc = function(term, location) {
                var self, loc;
                self = this;
                loc = {
                    firstLine: location.first_line,
                    lastLine: location.last_line,
                    firstColumn: location.first_column,
                    lastColumn: location.last_column
                };
                term.location = function() {
                    var self;
                    self = this;
                    return loc;
                };
                return term;
            };
            self.unindent = function(columns, string) {
                var self, r;
                self = this;
                r = new RegExp("\\n {" + columns + "}", "g");
                return string.replace(r, "\n");
            };
            self.normaliseString = function(s) {
                var self, s;
                self = this;
                s = s.substring(1, s.length - 1);
                return s.replace(/''/g, "'");
            };
            return self.parseRegExp = function(s) {
                var self, match;
                self = this;
                match = /^r\/((\n|.)*)\/([^\/]*)$/.exec(s);
                return {
                    pattern: match[1].replace(/\\\//g, "/").replace(/\n/, "\\n"),
                    options: match[3]
                };
            };
        });
    };
})).call(this);