# Introduction #

While parjser does not depend directly on any third-party libraries, it is built using a number of external tools and utilities. In addition the Parjser Playground sample page depends on third-party libraries.

This page lists tools, utilities and libraries which are or were used at some point in producting and/or deploying parjser.

## Google Closure Compiler ##
Parjser uses the [google closure compiler](http://code.google.com/closure/) to compress and optimize its javascript libraries.

## Make ##
Parjser uses and old school GNU makefile to control the build process with [GNU Make](http://www.gnu.org/software/make/).

## JSLINT ##
[JSLINT](http://www.jslint.com/), the JavaScript Code Quality Tool by Douglas Crockford is used in the Parjsers Playground sample webpage to provide sensible error messages for user supplied grammars.

## Geany and Gedit ##
Parjser is coded using the text editors Geany and Gedit.

## Browsers ##
Parjser is debugged using Mozilla Firefox and the Firebug plugin, and Google Chrome and its built-in developer tools.

## SQLite ##
The Sqlite grammar in parjser.grammars.sqlite was adapted from [the official SQLite documentation](http://www.sqlite.org/lang.html)