codegen utils = require './codegenUtils'
argument utils = require './argumentUtils'

module.exports (terms) =
    function call term = terms.term {
        constructor (
            fun
            args
            optional arguments: []
            async: false
            pass this to apply: false
            originally async: false
        ) =
            self.is function call = true

            self.function = fun
            self.function arguments = args
            self.optional arguments = optional arguments
            self.splatted arguments = self.cg.splat arguments (args, optional arguments)
            self.pass this to apply = pass this to apply
            self.is async = async
            self.originally async = originally async

        has splat arguments () =
            self.splatted arguments
      
        generate java script (buffer, scope) =
            self.function.generate java script (buffer, scope)
        
            args = codegen utils.args and optional args (self.cg, self.function arguments, self.optional arguments)
        
            if (self.splatted arguments && self.function.is indexer)
                buffer.write ('.apply(')
                self.function.object.generate java script (buffer, scope)
                buffer.write (',')
                self.splatted arguments.generate java script (buffer, scope)
                buffer.write (')')
            else if (self.splatted arguments)
                buffer.write ('.apply(')

                if (self.pass this to apply)
                    buffer.write ('this')
                else
                    buffer.write ('null')

                buffer.write (',')
                self.splatted arguments.generate java script (buffer, scope)
                buffer.write (')')
            else
                buffer.write ('(')
                codegen utils.write to buffer with delimiter (args, ',', buffer, scope)
                buffer.write (')')

        make async call with callback (callback) =
            fc = self.clone ()
            fc.function arguments.push (callback)
            fc
    }

    function call (
        fun
        args
        optional arguments: []
        async: false
        pass this to apply: false
        originally async: false
    ) =
        if (async)
            async result = terms.async result ()

            terms.argument utils.asyncify arguments (args, optional arguments)

            return (
                terms.sub statements [
                    terms.definition (
                        async result
                        function call term (
                            fun
                            args
                            optional arguments: optional arguments
                            pass this to apply: pass this to apply
                            originally async: true
                        )
                        async: true
                    )
                    async result
                ]
            )
        else if (fun.variable)
            name = fun.variable
            macro = terms.macros.find macro (name)
        
            if (macro)
                return (macro (name, args, optional arguments))

        function call term (
            fun
            args
            optional arguments: optional arguments
            pass this to apply: pass this to apply
            originally async: originally async
        )
