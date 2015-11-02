# Introduction #

In order to fully understand parjser grammars, it's helpful to examine an example grammar in detail. For this purpose, we will take a closer look at a parjser grammar that describes basic arithmetic expressions. This grammar is included in the parjser project in the file `parjser.grammars.arithmetic.js`

Note that this page does not discuss the notation and constructs that make up a parjser grammar: this is the topic of [another wiki page](http://code.google.com/p/parjser/wiki/ParjserGrammars).

# The arithmetic grammar #
First, let's consider the grammar as a whole:

```
{
  startSymbol: "calculation",
  ignoreTokens: {"whitespace":true},
  tokens:  {
    whitespace: /\s+/,
    number: /\d*\.?\d+([eE][\-+]?\d+)?/,
    addsub_operator: /[\+\-]/,
    muldiv_operator: /[\*\/]/,
    exp_operator: /\^/,
    lparen: /\(/,
    rparen: /\)/
  },
  rules:  {
    atom: ["|",["lparen","calculation","rparen"],"number"],
    calculation: ["|","addsub","atom"],
    addsub: ["addsub_operand",["addsub_operator","addsub_operand"],"*"],
    addsub_operand: ["muldiv_operand",["muldiv_operator","muldiv_operand"],"*"],
    muldiv_operand: ["exp_operand",["exp_operator","exp_operand"],"*"],
    exp_operand: ["addsub_operator","?","atom"]
  }
}
```

# The arithmetic Operators #
The arithmetic grammar defines the following operators:

  * `+` and `-` (matched by the `addsub_operator` terminal rule)
  * `*` and `/` (matched by the `muldiv_operator` terminal rule)
  * `^` (matched by the `exp_operator` terminal rule)
  * `(` and `)` (matched by the terminal rules for `lparen` and `rparen` respectively)

The operators `+`, `-`, `*`, `/` and `^` can all be used as binary operators, that is, they can take both a left and a right operand to perform a calculation upon them. The `+` and `-` operators can also be used as unary operators, effectively determining the sign of the expression at the right-hand side of the operator.

# Operator Associativity #