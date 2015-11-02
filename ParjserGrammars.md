# Introduction #

The parjser project does not provide parsers tailored to parse a particular language. Rather, it offers generic parsers that parse text according to a specific grammar. The grammar is passed to the parser's constructor, and the parser can then use the grammar to discover a structure in the input text according to the syntax rules defined in the grammar.

# Grammar Objects #
Parjser grammars are JavaScript objects. The parjser project currently does not supply a constructor for grammar objects. Instead, they can be created as a JavaScript object literal.

The general form of a parjser grammar object literal is shown below:
```
{
  tokens:  {
 
      ...terminal rules...
     
  },
  ignoreTokens: {
  
      ...ignorable terminal rules...

  },
  rules:  {

      ...non-terminal rules...

  },
  startSymbol: "symbol"
}
```

The structure shown above represents an ordinary JavaScript object literal with the members `tokens`, `ignoreTokens`, `rules`, and `startSymbol`.

## Symbols ##
The members of the `tokens` and `rules` members each represent a collection of rules, defining the grammar's terminal and non-terminal symbols respectively. In both cases, the member name is the symbol name that appears at the left-hand side of the rule, and the member value represents the rule's right hand side. Specifics concerning the definition of right-hand side of the rules is explained in detail in the sections dedicated to the `tokens` and `rules` objects.

For now, it is good to mention that the collection of member names from the `tokens` and `rules` objects must be disjoint - in other words, a name used for a terminal symbol cannot also be used as the name for a non-terminal symbol (and vice versa).

Another thing to keep in mind symbols is that there are little restrictions with regard to symbol names, as you can use JavaScript regular identifiers as well as quoted identifiers (that is, strings), which can contain almost any character (for example, including whitespace and control characters). However, symbol names must not be equal to one of the strings used to denote an occurrence indicator (which are the strings `"?"`, `"+"`, and `"*"`, and any string matching the regular expression `/\{\d+(,\d+)?\}/`), nor to the string used to denote a choice (which is the pipe `"|"`). Occurrence indicators are explained in detail in the section about sequences, and choices are discussed in their own section.

Finally, it should be pointed out that members of JavaScript objects are unique: there can be only one member with a specific name per object. This means one cannot simply specify multiple rules with the same left-hand side. (More precisely, one can specify them, but only one will be retained, silently discarding the others.) However, multiple rules can be specified for a single symbol by using the choice element. This is explained further in the section dedicated to Choices.

## Tokens ##

The `tokens` member is itself an object that defines the terminal symbols used by the grammar. Each distinct member of the `tokens` member represents a rule defining a terminal symbol.

The member name is the rule's left-hand side, and can be used as symbol in the rules for the non-terminal symbols. (This is explained in further detail in the next section about the `rules` object.) The member value is the rule's right-hand side, and must be a [JavaScript regular expression](http://www.w3schools.com/jsref/jsref_obj_regexp.asp) that matches any string considered valid for that terminal symbol.

Note that any flags specified for the regular expression appearing at the right hand side of the non-terminal rules are ignored.

By way of example, a grammar that can handle basic arithmetic may have the following `tokens`:
```
  tokens: {
    number: /\d*\.?\d+([eE][\-+]?\d+)?/,
    addsub_operator: /[\+\-]/,
    muldiv_operator: /[\*\/]/,
    exp_operator: /\^/,
    lparen: /\(/,
    rparen: /\)/
  }
```
## Rules ##

The `rules` member is itself an object that defines the non-terminal symbols used by the grammar. Each distinct member of the `rules` member represents a rule defining a non-terminal symbol.

As is the case with the `tokens` object, the member name is the rule's left-hand side. The value of the member represents the right-hand side of the rule, and can be either a JavaScript string literal or an array.

A JavaScript string literal appearing as the value of a member of the `rules` object indicates a (terminal or non-terminal) symbol. Either the `tokens` or the `rules` object must have a member with a name equal to the string's value. In other words, any symbol used in the right-hand side of the members of the `rules` object must be defined as either a terminal or a non-terminal symbol.

If an array is used as value for a member of the `rules` object, it can either denote a sequence or a choice. Sequences indicate the consecutive appearance of its elements. Choices indicate a number of possible rules from which one must be selected. To distinguish choices from sequences, the first array element of a choice array is always the reserved string `"|"` (pipe character).

The example below illustrates these different forms of members of the `rules` object:
```
  rules: {
    symbol1: "symbol2",                 //string literal indicates a symbol
    sequence: ["symbol1", "symbol2"],   //array indicates a sequence of symbols
    choice: ["|", "symbol1", "symbol2"] //choice indicates either symbol could appear
  }
```

## Sequences ##
A sequence indicates the consecutive appearance of its elements. In parjser grammar objects, a sequence is denoted as an array. Array elements can either be JavaScript string literals or JavaScript arrays.

Just like an array appearing as value for a member of the `rules` member, a JavaScript array used as element of a sequence array denotes either a sequence or a choice. If a JavaScript string literal is used as element of a sequence array, it can indicate either a (terminal or non-terminal) symbol, or an occurrence indicator.

Occurrence indicators are reserved strings that may occur as elements of a sequence array. Unlike regular strings, occurrence indicators do not refer to a symbol; rather, they control the number of occurrences of the array element that immediately precedes it.

The collection of reserved strings used to denote occurrence indicators is shown below:
  * `"?"` indicates optional occurrence: the array element immediately preceding the occurrence indicator may be present, but may also be omitted.
  * `"+"` indicates indefinitely repeatable occurrence: the array element immediately preceding the occurrence indicator must be present at least once, and may optionally occur anny number of times beyond the initial occurrence
  * `"*"` indicates optional and indefinitely repeatable occurrence: the array element immediately preceding the occurrence indicator may be present any number of times or be omitted alltogether.
  * A string matching the regular expression `/\{\d+(,\d+)\}/` indicates an exact indication of occurrence. In English, this regular expression reads: a left curly brace, immediately followed by a positive integer (defined as a sequence the of one or more digits), optionally followed by a comma and another positive integer, immediately followed by a right curly brace. The first integer indicates the minimum number of occurrences of the previous array element. The second integer (if present) indicates the maximum number of occurrences. For example, the occurrence indicator `"?"` could also be written as `"{0,1}"`

The example below indicates a rule for the `operation` symbol which might be defined to described the syntax for a (binary) arithmetic operator, like plus or minus. The rule's right hand side is a simple sequence, indicating an `"operand"` symbol followed by an `"operator"` symbol, followed by an `"operand"` symbol:

```
  tokens: {
    ...rules for "operator" and "operand" go here...
  },
  rules: {
    binary_operation: ["operand", "operator", "operand"]
  },
  ...
```

The next example illustrates the usage of occurrence indicators and defines a rule which might be defined to describe the syntax for a unary plus or minus operation. The rule's right hand side forms sequence, indicating the optional occurrence of the unary operator, followed by an operand:

```
  tokens: {
    ...rules for "operator" and "operand" go here...
  },
  rules: {
    unary_operation: ["operator", "?", "operand"]
  },
  ... 
```

Note that the second string literal in the sequence above is an occurrence indicator, and does not refer to a symbol.

The next example demonstrates how to use a sequence within a sequence:

```
  tokens: {
    ...rules for "operator" and "operand" go here...
  },
  rules: {
    expression: ["operand", ["operator", "operand"], "*"]
  },
  ...
```

In the example above, the sequence `["operator", "operand"]` forms a single unit. The optional and repeatable occurrence indicator `"*"` operates on this inner sequence as a whole. Note that an equivalent grammar could be constructed without an inner sequence by creating a separate rule for the inner sequence, and using its symbol instead of the inner sequence. This is shown below:

```
  tokens: {
    ...rules for "operator" and "operand" go here...
  },
  rules: {
    expression: ["operand", "expression_tail", "*"],
    expression_tail: ["operator", "operand"]
  },
  ...
```

## Choices ##
Choices are denoted using JavaScript arrays, just like sequences. To distinguish between the two, arrays that denote a choice have the reserved string `"|"` as their first element. Choices allow one to define multiple rules for a single symbol.

The elements of a choice array that appear after the initial special `"|"` string can be strings (indicating a terminal or non-terminal symbol) or arrays (indicating a sequence of a choice).

The following example illustrates yet another way to define the syntax for a binary operator:
```
  tokens: {
    ...rules for "operator" and "number" go here...
  },
  rules: {
    right_operand: ["|", "operation", "number"],
    operation: ["number", "operator", "right_operand"]
  },
  ...
```

In the example above, `operation` is defined as the sequence of a `"number"`, followed by an `"operator"`, followed by a `"right_operand"`. The rule for `right_operand` is a choice (as indicated by the initial string `"|"`) and provides the alternatives `"operation"` and `"number"`.

Choices can also appear within sequences. The previous example could have been written in a more compact manner as shown below:


```
  tokens: {
    ...rules for "operator" and "number" go here...
  },
  rules: {
    operation: ["number", "operator", ["|", "operation", "number"]]
  },
  ...
```

Note that occurrence indicators are not allowed as elements of a choice array - occurrence indicators are only allowed as elements of sequence arrays. If you need to specify occurrence for one of the alternatives that appears within a choice, you can turn the alternative into a sequence consisting of one symbol, followed by the desired occurrence indicator.

## Start Symbol ##
The `startSymbol` member of the parjser grammar object must be assigned a JavaScript string that refers to an existing non-terminal symbol. The start symbol identifies the main rule that stands for the language that is described by the grammar.

## Ignored Tokens ##
The parjser grammar objects support an optional `ignoreTokens` member. The purpose of this member is to allow for specific tokens to appear throughout the input text but which are not considered part of any rules.

Typical usage for the `ignoreTokens` member is to handle whitespace and comments. Most programming languages allow for whitespace and comments throughout the pieces of text that actually contribute to the running program. While it is possible to explicitly specify the optional occurrence of whitespace and comments between just about any elements in any grammar rule, this is highly unpractical. Instead, you can specify that those tokens are to be ignored.

For example, the following grammar describes addition and subtraction operations, but allows whitespace, C-style comments and C++ single line comments to appear anywhere between operands and operators:
```
{
    tokens: {
        whitespace: /\s+/,
        single_line_comment: /\/\/[^\n]*\n/,
        multi_line_comment: /\/\*([^*]|\*(?!\/))*\*\//,
        number: /\d*\.?\d+([eE][\-+]?\d+)?/,
        operator: /[\+\-]/ 
    },
    ignoreTokens: {
        whitespace: true, 
        single_line_comment: true,
        multi_line_comment: true
    },
    rules: {
        addsub: ["number", ["operator", "addsub"], "*"]
    },
    startSymbol: "addsub"
}
```

Note that those tokens named in the `ignoreTokens` object are consumed from the input, but otherwise completely ignored. This means they also do not appear in the parse tree returned by the parser.

## Case insensitive languages ##
The grammar definition allows for an optional `ignoreCase` member. If the `ignoreCase` member is present and has the boolean value `true`, terminal symbols will be matched in a case-insensitive manner.