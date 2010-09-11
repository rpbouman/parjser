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
