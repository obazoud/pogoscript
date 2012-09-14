((function() {
    var self;
    self = this;
    module.exports = function(terms) {
        var self;
        self = this;
        return terms.term({
            constructor: function(target, source, gen1_options) {
                var async, self;
                async = gen1_options && gen1_options.hasOwnProperty("async") && gen1_options.async !== void 0 ? gen1_options.async : false;
                self = this;
                self.isDefinition = true;
                self.target = target;
                self.source = source;
                return self.isAsync = async;
            },
            expression: function() {
                var self;
                self = this;
                return self;
            },
            hashEntry: function() {
                var self;
                self = this;
                return self.cg.hashEntry(self.target.hashEntryField(), self.source);
            },
            generateJavaScript: function(buffer, scope) {
                var self;
                self = this;
                self.target.generateJavaScriptTarget(buffer, scope);
                buffer.write("=");
                return self.source.generateJavaScript(buffer, scope);
            },
            declareVariables: function(variables, scope) {
                var self;
                self = this;
                return self.target.declareVariable(variables, scope);
            },
            makeAsyncWithCallbackForResult: function(createCallbackForResult) {
                var self, callback;
                self = this;
                if (self.isAsync) {
                    callback = createCallbackForResult(self.target);
                    return self.source.makeAsyncCallWithCallback(callback);
                }
            }
        });
    };
})).call(this);