# Grammar concepts #

There are a lot of great books and online resources on the topic of grammars in relation to parser generation and compiler construction. Therefore, we won't provide exhaustive background to the subject. Instead, we define the key terms here so we can refer to them in the next section which describes the format of parjser grammars in detail. With a bit of googling you should be able to find more in-depth resources that help you put these concepts into the proper context, and recognize similarities and differences with other tools for constructing parsers.

## Context Free Grammar ##
In the most general sense, a [grammar](http://en.wikipedia.org/wiki/Formal_grammar) is a set of rules that describe all sentences that belong to a particular language. Most types parsers, including those provided by parjser, require a special class of grammar called a [context free grammar](http://en.wikipedia.org/wiki/Context-free_grammar).

### Rules ###
A context free grammar consists of a set of rules, where each rule has a left-hand side consisting of a symbol, and a right-hand side consisting of a (possibly) empty sequence of symbols. The pairing of the symbol at the left-hand side with the symbol sequence at the right-hand side expresses a kind of equivalence relationship.

Depending on what you want to achieve, grammar rules can be applied from left-to-right as well as from right-to-left. Applying rules from left-to-right is a productive process, as left hand symbols get substituted by right hand sequences. When there are no more non-terminals left (due to replacement by non-terminals), the result is a sentence of the language described by the grammar. Applying rules from right-to-left is a reducing process, as collections of terminals get replaced by non-terminals.

### Terminal and Non-Terminal Symbols ###
The symbols that appear in any right-hand side may also appear at the left hand side of any of the grammar's rules. If that is the case, such a symbol is called a non-terminal symbol, or simply a non-terminal. Such a symbol is non-terminal because it may be replaced by any of right hand sides of the rules that have that symbol as its left-hand side. By definition, the right-hand side symbols that do not appear as left-hand side of any grammar rule are called terminals, because there are no rules available to replace those symbols with.

Another way of putting it is to say that a terminal symbol represents nothing but itself, whereas a terminal symbol can be de-composed further into other (terminal or non-terminal) symbols by subsequently applying the grammar rules that have that non-terminal as their left-hand side.

### Start Symbol ###
In addition to the rules, a context-free grammar also has a start symbol. The start symbol is one of the non-terminals: it appears on the left side of one or more grammar rules. When generating language sentences by applying rules from left to right, the start symbol identifies the rules that are to be applied at the start of the process. When applying rules from right-to-left, text is reduced in subsequently shorter sequences of symbols, until only the start symbol remains.

## Notation in Backus-Naur Form (BNF) ##
The grammar rules of a context-free grammar can be conveniently denoted using the Backus-Naur form (BNF).