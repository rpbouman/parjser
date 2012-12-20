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

function renderTokens(tokenizer, output, func) {
    var tokens = "<pre>", token, type, end, start;
    if (!func){
        func = tokenizer.next;
    }
    start = new Date().getTime();
    while ((token = func.call(tokenizer))!==parjser._EOF) {
        type  = token.type;
        tokens += "\ntype: " + type + "; " +
                        "text: \"" + token.text + "\"; " +
                        "ignored: " +
                        tokenizer.isIgnoredToken(token);
    }
    end = new Date().getTime();
    tokens = "<div>tokenizing: " + (end-start) + "ms" + "</div>" + tokens + "</pre>";
    if (output){
        output.innerHTML = tokens;
    }
    return tokens;
}

function toggleNode(node){
    var state = node.innerHTML, display,
        body = node.parentNode.parentNode.childNodes.item(1)
    ;
    switch (state) {
        case "+":
            state = "-";
            display = "";
            break;
        case "-":
            state = "+";
            display = "none";
            break;
    }
    body.style.display = display;
    node.innerHTML = state;
}

function renderNode(node, output){
    var content = "", children = node.children,
        label, type;
    if (children){
        for (var i=0; i<children.length; i++) {
            content+= renderNode(children[i]);
        }
    }
    type = node.type;
    if (node.token){
        if (type.token) {
            label = type.token;
        }
        else {
            label = type;
        }
    }
    else
    if (typeof(type)==="string"){
        label = type;
    }
    else {
        if (type.originalRuleString) {
            label = type.originalRuleString;
        }
        else
        if (type.originalRule){
            label = JSON.stringify(type.originalRule);
        }
        else {
            label = JSON.stringify(type);
        }

        if (type.symbol) {
            label = type.symbol + ": " + label;
        }
    }
    var str = "" +
        "<div class=\"node\">"+
          "<div class=\"node-head\">"+
            "<span class=\"node-toggle\""+
            "  onclick=\"toggleNode(this);\">-</span>"+
              label +
              (node.token ? " (\"" + node.token.text + "\")" : "") +
          "<\/div>"+
          "<div class=\"node-body\">"+
            content +
          "<\/div>"+
        "<\/div>"
    ;
    if (output){
        output.innerHTML = str;
    }
    return str;
}

function stringToConf(value){
    var c;
    if (!JSLINT("c = " + value + ";")) {
        throw "Invalid Configuration";
    }
    return eval("(" + value + ")");
}

function printJSLintErrors(output){
    var errors = JSLINT.errors, numErrors = errors.length,
        error, i=0, report = "Errors in your configuration:<pre>";
    for (i=0; i<numErrors; i++) {
        error = errors[i];
        if (error===null ){
            continue;
        }
        report += "\nline " + (error.line===null?"null":error.line) +
                ", char " + error.character +
                ": " + error.reason +
                " (" + error.evidence + ")";
    }
    output.innerHTML = report + "</pre>";
}

function serializeGrammar(grammar) {
    var value = "",
        p, r, l, i;
    for (p in grammar) {
        if (value!=="") {
            value += ",\n";
        }
        value += "  " + p + ": ";
        switch (p) {
            case "tokens":
            case "rules":
                value += " {";
                l = grammar[p];
                for (i in l){
                    if (r) {
                        value += ",";
                    }
                    value += "\n    \"" + i + "\": ";
                    r = l[i];
                    if (r instanceof RegExp) {
                        value += r.toString();
                    }
                    else {
                        value += JSON.stringify(r);
                    }
                }
                r = null;
                value += "\n  }";
                break;
            default:
                value += JSON.stringify(grammar[p]);
        }
    }
    return "{\n" + value + "\n}";
}
