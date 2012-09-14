module.exports (terms) = terms.term {
    constructor (target, source, async: false) =
        self.is definition = true
        self.target = target
        self.source = source
        self.is async = async

    expression () =
        self
  
    hash entry () =
        self.cg.hash entry (self.target.hash entry field (), self.source)

    generate java script (buffer, scope) =
        self.target.generate java script target (buffer, scope)
        buffer.write ('=')
        self.source.generate java script (buffer, scope)
  
    declare variables (variables, scope) =
        self.target.declare variable (variables, scope)

    make async with callback for result (create callback for result) =
        if (self.is async)
            callback = create callback for result (self.target)
            self.source.make async call with callback (callback)
}