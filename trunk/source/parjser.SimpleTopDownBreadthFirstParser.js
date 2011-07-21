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

(function () {

parjser.grammars.test = {
    tokens: {
        digits: /[0-9]+/,
        operator: /[\-\+]/
    },
    rules: {
        E: ["|", ["E", "operator", "digits"], "digits"]
    },
    startSymbol: "E"
};

parjser.SimpleTopDownBreadthFirstParser = function(conf) {
    this.init(conf);
    this.prune = conf.prune;
    return this;
};

parjser.SimpleTopDownBreadthFirstParser.prototype = {
    init: function(conf){
        this.tokens = conf.tokens ? conf.tokens : {};
        this.tokenizer = conf.tokenizer ? conf.tokenizer
                                        : new parjser.RegexTokenizer(conf);
        this.rules = conf.rules ? conf.rules : {};
        this.startSymbol = conf.startSymbol;
        this.tokenBuffer = null;
    },
    getToken: function(index){
        var token, tokenBuffer = this.tokenBuffer;
            
        if (index < tokenBuffer.length) {
            token = tokenBuffer[index];
        }
        else {
            token = this.tokenizer.nextToken();
            tokenBuffer.push(token);
        }
        return token;
    },
    parse: function(text, symbol) {
        var tokens = this.tokens,
            rules = this.rules,
            stack = [], initialState,
            states, numStates, stateIndex, state, nextStates,
            rule, token, property,
            rulePart, numRuleParts, rulePartIndex, newState
        ;
        
        if(!symbol){
            if (this.startSymbol) {
                symbol = this.startSymbol;
            }
            else {
                throw "No symbol specified or implied";
            }
        }
        this.tokenBuffer = [];
        this.tokenizer.setText(text);
        states = [
            initialState = {
                type: [symbol, parjser._EOF],
                derivedFrom: null,
                nextState: null,
                position: 0
            }
        ];
        stack: while (numStates = states.length) {
            stack.push(states);
            nextStates = [];
            states: for (stateIndex=0; stateIndex<numStates; stateIndex++){
                state = states[stateIndex];
                if (typeof(state.min)!=="undefined" && state.min===0 && state.nextState){
                    newState = state.nextState;
                    states.push({
                        type: newState.type,
                        partOf: newState.partOf,
                        nextState: newState.nextState,
                        prevCount: newState.prevCount,
                        min: newState.min,
                        max: newState.max,
                        position: state.position
                    });
                    numStates++;
                }
                if (typeof(state.max)!=="undefined" && state.max===Number.POSITIVE_INFINITY) {
                    nextStates.push({
                        type: state.type,
                        partOf: state.partOf,
                        nextState: state.nextState,
                        prevCount: 1,
                        min: state.min,
                        max: state.max,
                        position: state.position
                    });
                }
                rule = state.type;
                if (typeof(rule)==="string"){
                    //terminal symbol
                    if (tokens[rule]) {
                        token = this.getToken(state.position);
                        if (token.type===rule){
                            state.token = token;
                            if (state.nextState){
                                if (state.nextState.prevCount>1){
                                    state.nextState.prevCount--;
                                    newState = {};
                                    for (property in state.nextState){
                                        newState[property] = state.nextState[property];
                                    }
                                    newState.prevCount = 1;
                                    state.nextState = newState;
                                }
                                else {
                                    newState = state.nextState;
                                }
                                newState.position = state.position + 1;
                                nextStates.push(newState);
                            }
                            else {
                                //not really sure what this case means.
                            }
                        }
                        else {
                            //dead end, clean up.
                        }
                    }
                    //non-terminal symbol
                    else {
                        nextStates.push({
                            type: rules[rule],
                            derivedFrom: state,
                            nextState: state.nextState,
                            position: state.position,
                            prevCount: 0
                        });
                        if (state.nextState){
                            state.nextState.prevCount++;
                        }
                        else {
                            //not really sure what this case meanse
                        }
                    }
                }
                else
                if (rule instanceof Array) {
                    numRuleParts = rule.length;
                    if (rule[0]==="|") {
                        for (rulePartIndex = 1; rulePartIndex < numRuleParts; rulePartIndex++){
                            nextStates.push({
                                type: rule[rulePartIndex],
                                derivedFrom: state,
                                nextState: state.nextState,
                                position: state.position
                            });
                            state.nextState.prevCount++;
                        }
                    }
                    else {                        
                        var min, max, rulePart, card, first,
                            prev = null, first;
                        first = null;
                        for (rulePartIndex = 0; rulePartIndex < numRuleParts; rulePartIndex++){
                            rulePart = rule[rulePartIndex];
                            if (++rulePartIndex < numRuleParts) {
                                switch (rule[rulePartIndex]) {
                                    case "?":
                                        min = 0; max = 1;
                                        break;
                                    case "+":
                                        min = 1; max = Number.POSITIVE_INFINITY;
                                        break;
                                    case "*":
                                        min = 0; max = Number.POSITIVE_INFINITY;
                                        break;
                                    default:
                                        min = 1; max = 1;
                                        rulePartIndex--;
                                }
                            }
                            else {
                                min = 1; max = 1;
                                rulePartIndex--;
                            }
                            newState = {
                                type: rulePart,
                                partOf: state,
                                min: min,
                                max: max
                            };
                            if (first===null){
                                first = newState;
                                newState.prevCount = 0
                            }
                            if (prev) {
                                prev.nextState = newState;
                                newState.prevCount = 1;
                            }
                            prev = newState;
                        }
                        newState.nextState = state.nextState;
                        first.position = state.position;
                        nextStates.push(first);
                    }
                }
                else
                if (rule === parjser._EOF){
                    token = this.getToken(state.position);
                    if (token===parjser._EOF) {
                        //hurray, we found a parse!
                        //todo: allow ambiguous parses
                        this.buildTree(state, stack, stack.length - 1);
                        return initialState.children[0];
                    }
                    else {
                        //dead end, clean up.
                    }
                }
                else
                if (rule === null){
                    newState = state.nextState;
                    if (newState) {
                        nextStates.push(newState);
                    }
                    else {
                        //not really sure what this case means
                    }
                }
                else {
                    throw "Rule \"" + rule + "\" has the wrong type.";
                }
            }   //end of states loop
            states = nextStates;
        }   //end of stack loop
        //todo: throw syntax error exception
        throw "Syntax error";
    },
    buildTree: function(state, stack, stackIndex){
        var parent, children, states, numStates, i;
        if (state.partOf) {
            parent = state.partOf;
        }
        else
        if (state.derivedFrom) {
            parent = state.derivedFrom;
        }
        
        if (parent) {
            if (!(children = parent.children)) {
                parent.children = [state];
            }
            else {
                children.unshift(state);
            }            
        }

        if (state.partOf){
            if (stackIndex) {
                for (states = stack[--stackIndex], i=0, numStates = states.length; i<numStates; i++){
                    if (states[i].nextState === state) {
                        return this.buildTree(states[i], stack, stackIndex);
                    }
                }
                state = this.buildTree(state.partOf, stack, stackIndex);
            }
        }
        else
        if (state.derivedFrom){
            state = this.buildTree(state.derivedFrom, stack, --stackIndex);
        }
        
        return state;
    }
};

}());
