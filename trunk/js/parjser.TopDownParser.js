/*
    Copyright Roland Bouman
    Roland.Bouman@gmail.com
    http://rpbouman.blogspot.com/
 
    This file is part of parjser: http://code.google.com/p/parjser

    parjser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as
    published by the Free Software Foundation, either version 3
    of the License, or (at your option) any later version.

    parjser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Lesser Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with parjser.  If not, see <http://www.gnu.org/licenses/>.
*/

(function(){

if (typeof(parjser)==="undefined"){
    parjser = {};
}

parjser._EOF = {type: "_EOF"};
parjser._DEBUGGER = {type: "_DEBUGGER"};

if (!parjser.grammars){
    parjser.grammars = {};
}

}());
            
/*
    Copyright Roland Bouman
    Roland.Bouman@gmail.com
    http://rpbouman.blogspot.com/
 
    This file is part of parjser: http://code.google.com/p/parjser

    parjser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as
    published by the Free Software Foundation, either version 3
    of the License, or (at your option) any later version.

    parjser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Lesser Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with parjser.  If not, see <http://www.gnu.org/licenses/>.
 */
(function() {


/**
 * 
 *  Exception
 * 
 */
parjser.Exception = function(type, tokenizer){
    this.type = type;
    if (tokenizer) {
        this.initFromTokenizer(tokenizer);
    }
    return this;
};

parjser.Exception.prototype = {
    initFromTokenizer: function(tokenizer){
        this.offset = tokenizer.offset;
        this.text = tokenizer.originalText;
        this.initLineAndColumnInfo();
    },
    initLineAndColumnInfo: function(){
        var offset = this.offset,
            textSoFar = this.text.substr(0, offset),
            noNewLines = textSoFar.replace(/\n/g, ""),
            lastLine
        ;
        this.line = 1 + textSoFar.length - noNewLines.length;
        lastLine = textSoFar.lastIndexOf("\n");
        this.column = offset - lastLine;
        this.lastLine = textSoFar.substr(lastLine, this.column);
    },
    toString: function() {
        return this.type +
            " at line " + this.line +
            ", column " + this.column + ": " +
            this.lastLine
            ;
    }
};

/**
 * 
 *  SyntaxErrorException
 * 
 */
parjser.SyntaxErrorException = function(tokenizer, lastToken, lastSymbol){
    this.initFromTokenizer(tokenizer);
    this.lastToken = lastToken;
    this.lastSymbol = lastSymbol;
};

parjser.SyntaxErrorException.prototype = new parjser.Exception("SyntaxErrorException");
parjser.SyntaxErrorException.prototype.toString = function(){
    return parjser.Exception.prototype.toString.call(this) +
    "\nwhile parsing " + this.lastSymbol;
};

}())
/*
    Copyright Roland Bouman
    Roland.Bouman@gmail.com
    http://rpbouman.blogspot.com/
 
    This file is part of parjser: http://code.google.com/p/parjser

    parjser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as
    published by the Free Software Foundation, either version 3
    of the License, or (at your option) any later version.

    parjser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Lesser Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with parjser.  If not, see <http://www.gnu.org/licenses/>.
*/

(function() {

parjser.RegexTokenizer = function(conf){
    this.init(conf);
    return this;
};

parjser.RegexTokenizer.prototype = {
    init: function(conf){
        this.tokens = conf.tokens ? conf.tokens : {};
        this.tokenNames = [null];
        this.groups = [null];
        this.ignoreCase = (conf.ignoreCase===true) ? true : false;
        this.ignoredTokens = conf.ignoreTokens ? conf.ignoreTokens : {};
        this.text = null;
        this.offset = null;
        this.makeRegex(false);
    },
    makeRegex: function(debug){
        var token,
            tokens = this.tokens,
            r, re = "",
            regex,
            regexLength,
            group = 0,
            tokenNames = this.tokenNames,
            groups = this.groups;
                
        for(token in tokens){
            if (re!=="") {
                re += "|";
            }
            regex = tokens[token].toString();
            re += "(" + regex.substr(1, regex.length-2) + ")";
            if (debug) {
                r = new RegExp("^" + re, (this.ignoreCase ? "i" : "")+"g");
            }
            else {
                tokenNames.push(token);
                //calculate capturing groups so we can compensate
                regex = regex.replace(/\\\\/g, ""); //remove literal backslash first so we can match escaping backslashes
                regex = regex.replace(/\\\(/g, ""); //remove literal left parenthesis
                regex = regex.replace(/\(\?!/g, ""); //remove lookahead left parenthesis
                group++;
                groups.push(group);
                regexLength = regex.length;
                group += regex.length - regex.replace(/\(/g, "").length;
            }
        }
        if (!debug) {
            try {
                this.regex = new RegExp(re, (this.ignoreCase ? "i" : "")+"g");
            } catch (e) {
                this.makeRegex(true);
            }
        }
    },
    isIgnoredToken: function(token){
        return token.type in this.ignoredTokens;
    },
    setText: function(text){
        this.originalText = text;
        this.text = text;
        this.offset = 0;
    },
    next: function(){
        var text = this.text,
            offset = this.offset,
            match,
            match0,
            matchLength,
            numTokens,
            i,
            groups
        ;
        if (offset >= text.length) {
            return parjser._EOF;
        }
        if ((match = this.regex.exec(text))===null){
            this.throwNoMatchException();
        }
        else
        if (match.index!==this.offset){
            this.throwNoMatchException();
        }
        match0 = match[0];
        matchLength = match0.length;
        groups = this.groups;
        this.offset += matchLength;
        for (i=1, numTokens = match.length; i<numTokens; i++) {
            if (match[groups[i]]) {
                token = this.tokenNames[i];
                return {
                    text: match0,
                    len: matchLength,
                    off: offset,
                    type: token
                }
                break;
            }
        }
        this.throwNoMatchException();
    },
    nextToken: function(){
        var token;
        while (this.isIgnoredToken(token = this.next())){}
        return token;
    },
    throwNoMatchException: function(){
        var exception = new parjser.Exception(
            "NoMatchFound", this
        );
        throw exception;
    }
};

}());
/*
    Copyright Roland Bouman
    Roland.Bouman@gmail.com
    http://rpbouman.blogspot.com/
 
    This file is part of parjser: http://code.google.com/p/parjser

    parjser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as
    published by the Free Software Foundation, either version 3
    of the License, or (at your option) any later version.

    parjser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Lesser Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with parjser.  If not, see <http://www.gnu.org/licenses/>.
 */


(function(){

parjser.GrammarCompiler = function(){
};

parjser.GrammarCompiler.compile = function(conf){
    var symbol, rule, compiledRule, startSymbol,
        tokens,
        rules = conf.rules ? conf.rules : {},
        prune = conf.prune ? true : false,
        tokenizer, 
        compiledRules = {},
        compiledGrammar = {
            tokens: null,
            tokenizer: null,
            rules: null,
            prune: prune
        },
        parserClass = conf.parserClass ? conf.parserClass : parjser.TopDownParser,
        parserClassPrototype = parserClass.prototype,
        parseEmpty = parserClassPrototype.parseEmpty,
        parseChoice = parserClassPrototype.parseChoice,
        parseSequence = parserClassPrototype.parseSequence,
        parseToken = parserClassPrototype.parseToken,
        parseRule = parserClassPrototype.parseRule
    ;

    var initTokens = function(){
        if (conf.tokens){
            tokens = conf.tokens;
        }
        else {
            tokens = {};
            r = {};
            for (rule in rules){
                compiledRule = rules[rule];
                if (compiledRule instanceof RegExp){
                    tokens[rule] = compiledRule;
                }
                else {
                    r[rule] = compiledRule;
                }
            }
            rules = r;
        }
        compiledGrammar.tokens = tokens;
    }

    var initTokenizer = function(){
        if (conf.tokenizer) {
            tokenizer = conf.tokenizer;
        }
        else {
            tokenizer = new parjser.RegexTokenizer({
                tokens: tokens,
                ignoreCase: conf.ignoreCase,
                ignoreTokens: conf.ignoreTokens
            });
        }
        compiledGrammar.tokenizer = tokenizer; 
    }
    var initStartSymbol = function() {    
        if (conf.startSymbol) {
            startSymbol = conf.startSymbol;
        }
        else {
            for (startSymbol in rules) {
                break;
            }
        }
        if (!rules[startSymbol]) {
            throw "No rule found for symbol " +  startSymbol;
        }
        compiledGrammar.startSymbol = startSymbol;
    };
    
    var setCardinality = function(compiledRule, array, i){
        var i, arrayLength = array.length, nextElement, cardinality;
        nextElement = i+1;
        if (nextElement < arrayLength){
            cardinality = array[nextElement];
            if (typeof(cardinality)==="string"){
                i = nextElement;
                switch(cardinality) {
                    case "?":
                        compiledRule.minOccurs = 0;
                        compiledRule.maxOccurs = 1;
                        break;
                    case "+":
                        compiledRule.minOccurs = 1;
                        compiledRule.maxOccurs = Number.POSITIVE_INFINITY;
                        break;
                    case "*":
                        compiledRule.minOccurs = 0;
                        compiledRule.maxOccurs = Number.POSITIVE_INFINITY;
                        break;
                    default:
                        match = /^\{(\d+)(,(\d+))?\}$/.exec(cardinality);
                        if (match && match[0]===cardinality){
                            if (match[1]) {
                                compiledRule.minCardinality = parseInt(match[1],10);
                            }
                            else {
                                compiledRule.minCardinality = 1;
                            }
                            if (match[3]) {
                                compiledRule.maxCardinality = parseInt(match[3],10);
                            }
                            else {
                                compiledRule.maxCardinality = 1;
                            }
                        }
                        else {
                            i--;
                        }
                }
            }
        }
        if (typeof(compiledRule.minOccurs)==="undefined"){
            compiledRule.minOccurs = 1;
        }
        if (typeof(compiledRule.maxOccurs)==="undefined"){
            compiledRule.maxOccurs = 1;
        }
        return i;
    };

    var compileRule = function(rule, compiledRule){
        var ruleLength, i, ruleParts, rulePart,
            existingCompiledRule, func, rulePartMinOccurs,
            property, first
            ;
        if (!compiledRule){
            compiledRule = {
                first: {}
            };
        }
        compiledRule.originalRule = rule;
        if (rule instanceof Array){
            ruleLength = rule.length;
            if (ruleLength===0){
                compiledRule.func = parseEmpty;
            }
            else {
                ruleParts = [];
                compiledRule.ruleParts = ruleParts;
                if (rule[0]==="|"){
                    func = parseChoice;
                    i = 1;
                }
                else {
                    func = parseSequence;
                    i = 0;
                }
                compiledRule.func = func;
            }
            rulePartMinOccurs = 0;
            for (; i<ruleLength; i++) {
                rulePart = rule[i];
                if (typeof(rulePart)==="undefined"){
                    throw "Undefined rulepart at index " + i +
                            " in rule " + JSON.stringify(rule);
                }
                rulePart = compileRule(rulePart);
                i = setCardinality(rulePart, rule, i);
                first = rulePart.first;
                if (func===parseChoice ||
                   (func===parseSequence && rulePartMinOccurs===0)
                ){
                    for (property in first) {
                        if (!compiledRule.first[property]){
                            compiledRule.first[property] = {};
                        }
                        compiledRule.first[property][ruleParts.length] = true;
                    }
                }
                rulePartMinOccurs += rulePart.minOccurs;
                compiledRule.ruleParts.push(rulePart);
            }
            if (rulePartMinOccurs===0) {
                compiledRule.minOccurs = 0;
            }
        }
        else
        if (typeof(rule)==="string"){
            if (tokens[rule]){
                compiledRule.token = rule;
                compiledRule.func = parseToken;
                first = {};
                first[rule] = {"0": true};
                compiledRule.first = first;
            }
            else
            if (rules[rule]){
                existingCompiledRule = compiledRules[rule];
                if (!existingCompiledRule) {
                    existingCompiledRule = {
                        symbol: rule,
                        minOccurs: 1,
                        maxOccurs: 1,
                        first: {}
                    };
                    existingCompiledRule.first[rule] = {"0": true};
                    compiledRules[rule] = existingCompiledRule;
                    compileRule(rules[rule], existingCompiledRule);
                }
                for (property in existingCompiledRule){
                    compiledRule[property] = existingCompiledRule[property];
                }
            }
            else {
                throw rule + " is neither a token nor a symbol.";
            }
        }
        else
        if (rule===null){
            compiledRule.func = parseEmpty;
        }
        return compiledRule;
    }

    var fixFirst = function(){
        var ruleName, compiledRule, first, symbol, symbols,
            rule, ruleFirst, token, firstToken, index, indexes;
        for (ruleName in compiledRules){
            compiledRule = compiledRules[ruleName];
            symbols = {};
            first = compiledRule.first;
            //identify all non-terminals in the first set
            for (symbol in first){
                rule = compiledRules[symbol];
                if(rule){
                    symbols[symbol] = rule;
                }
            }
            //replace non-terminals with all terminals in their first set
            for (symbol in symbols) {
                indexes = first[symbol];
                delete first[symbol];
                if (symbol===ruleName){
                    continue;
                }
                rule = symbols[symbol];
                ruleFirst = rule.first;
                for (token in ruleFirst) {
                    if (compiledRules[token]){
                        continue;
                    }
                    firstToken = first[token];
                    if (!firstToken){
                        firstToken = {};
                        first[token] = firstToken;
                    }
                    for (index in indexes) {
                        firstToken[index] = true; 
                    }
                }
            }
        }
    }

    var makeArray = function(rule){
        var first, token, index, array,
            ruleParts, numRuleParts, i, rulePart;
        rule.fixed = true;
        first = rule.first;
        for (token in first){
            indexes = first[token];
            if (indexes instanceof Array) {
                continue;
            }
            array = [];
            for (index in indexes){
                array.push(parseInt(index,10));
            }
            first[token] = array.sort();
        }
        ruleParts = rule.ruleParts;
        if (ruleParts){
            numRuleParts = ruleParts.length;
            for (i=0; i<numRuleParts; i++){
                rulePart = ruleParts[i];
                if (!rulePart.fixed){
                    makeArray(rulePart);
                }
            }
        }
    };

    var makeArrays = function(){
        var ruleName, compiledRule;
        for (ruleName in compiledRules){
            compiledRule = compiledRules[ruleName];
            makeArray(compiledRule);
        }
    }

    initTokens();
    initTokenizer();
    initStartSymbol();
    compileRule(startSymbol);
    fixFirst();
    makeArrays();
    compiledGrammar.rules = compiledRules;
    compiledGrammar.compiled = true;
    return compiledGrammar;    
}

}())
/*
    Copyright Roland Bouman
    Roland.Bouman@gmail.com
    http://rpbouman.blogspot.com/
 
    This file is part of parjser: http://code.google.com/p/parjser

    parjser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as
    published by the Free Software Foundation, either version 3
    of the License, or (at your option) any later version.

    parjser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Lesser Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with parjser.  If not, see <http://www.gnu.org/licenses/>.
*/
(function(){

parjser.TopDownParser = function(grammar){
    if (grammar.compiled) {
        this.grammar = grammar;
    }
    else {
        this.grammar = parjser.GrammarCompiler.compile(grammar);
    }
    this.tokenizer = this.grammar.tokenizer;
    this.prune = this.grammar.prune;
    return this;
}

parjser.TopDownParser.prototype = {
    initTokenBuffer: function(){
        this.tokenBuffer = [];
        this.tokenBufferPointer = -1;
    },
    nextToken: function(){
        var token,
            tokenBufferPointer = ++this.tokenBufferPointer,
            tokenBuffer = this.tokenBuffer
        ;
        if (tokenBufferPointer < tokenBuffer.length) {
            token = tokenBuffer[tokenBufferPointer];
        }
        else {
            token = this.tokenizer.nextToken();
            tokenBuffer.push(token);
        }
        return token;
    },
    parseRule: function(rule, parentNode){
        var node, prune = this.prune, numChildren,
            i=0, func = rule.func,
            maxOccurs = rule.maxOccurs,
            tokenBufferPointer
        ;
        for (; i<maxOccurs ; i++) {
            tokenBufferPointer = this.tokenBufferPointer;
            node = {children: []};
            if (func.call(this, rule, node)){
                node.offset = this.tokenizer.offset;
                node.tokenBufferPointer = tokenBufferPointer;
                node.type = rule;
                node.parentNode = parentNode;
                if (prune){
                    numChildren = node.children.length;
                    if (numChildren===1){
                        node = node.children[0];
                    }
                }
                parentNode.children.push(node);
            }
            else {
                this.tokenBufferPointer = tokenBufferPointer;
                node.children = null;
                node.parentNode = null;
                node.type = null;
                break;
            }
        }
        return i>=rule.minOccurs;
    },
    parseEmpty: function(rule, node){
        return true;
    },
    parseToken: function(rule, node){
        var token = this.nextToken();
        if (token.type === rule.token){
            node.token = token;
            return true;
        }
        else {
            return false;
        }
    },
    parseEOF: function(rule, node){
        return this.nextToken()===parjser._EOF;
    },
    parseChoice: function(rule, node) {
        var i=0,
            ruleParts = rule.ruleParts,
            numRuleParts = ruleParts.length;
        for (; i<numRuleParts; i++){
            if (this.parseRule(ruleParts[i], node)) {
                return true;
            }
        }
        return false;
    },
    parseSequence: function(rule, node){
        var i=0,
            ruleParts = rule.ruleParts,
            numRuleParts = ruleParts.length;
        for (; i<numRuleParts; i++){
            if (!this.parseRule(ruleParts[i], node)) {
                return false;
            }
        }
        return true;
    },
    initParse: function(text, symbol){
        if(!symbol){
            if (!(symbol = this.grammar.startSymbol)) {
                throw "No symbol specified or implied";
            }
        }

        var rule = this.grammar.rules[symbol];
        rule = {
            func: parjser.TopDownParser.prototype.parseSequence,
            ruleParts: [rule, parjser._EOF],
            minOccurs: 1, maxOccurs: 1
        };

        this.tokenizer.setText(text);
        this.initTokenBuffer();
        this.tree = {
            children: []
        };

        return rule;
    },
    parse: function(text, symbol){
        var rule = this.initParse(text,symbol);
        if (!this.parseRule(rule, this.tree)){
            this.throwSyntaxErrorException();
        }
        return this.tree.children[0].children[0];        
    },
    throwSyntaxErrorException: function(){
        var tokenBuffer = this.tokenBuffer,
            tokenBufferLength = tokenBuffer.length,
            exception = new parjser.SyntaxErrorException(
                this.tokenizer,
                tokenBufferLength ? tokenBuffer[tokenBufferLength-1] : null,
                this.lastSymbol ? this.lastSymbol : this.currentSymbol
            );
        throw exception;
    }   
};
    
parjser._EOF.func = parjser.TopDownParser.prototype.parseEOF;
parjser._EOF.minOccurs = 1;
parjser._EOF.maxOccurs = 1;

}())
