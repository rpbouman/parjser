parjser.js:
	cp source/parjser.js tmp/parjser.js

parjser.Exception.js:
	cp source/parjser.Exception.js tmp/parjser.Exception.js 

parjser.RegexTokenizer.js:
	cp source/parjser.RegexTokenizer.js tmp/parjser.RegexTokenizer.js 

parjser.core.js: parjser.js parjser.Exception.js parjser.RegexTokenizer.js
	cat tmp/parjser.js tmp/parjser.Exception.js tmp/parjser.RegexTokenizer.js > js/parjser.core.js

SimpleTopDownParser.js:
	cp source/parjser.SimpleTopDownParser.js tmp/parjser.SimpleTopDownParser.js

parjser.SimpleTopDownParser.js: parjser.core.js SimpleTopDownParser.js
	cat js/parjser.core.js tmp/parjser.SimpleTopDownParser.js > js/parjser.SimpleTopDownParser.js

GrammarCompiler.js:
	cp source/parjser.GrammarCompiler.js tmp/parjser.GrammarCompiler.js

TopDownParser.js:
	cp source/parjser.TopDownParser.js tmp/parjser.TopDownParser.js

parjser.TopDownParser.js: parjser.core.js GrammarCompiler.js TopDownParser.js
	cat js/parjser.core.js tmp/parjser.GrammarCompiler.js tmp/parjser.TopDownParser.js > js/parjser.TopDownParser.js

TopDownParserWithLookahead.js:
	cp source/parjser.TopDownParserWithLookahead.js tmp/parjser.TopDownParserWithLookahead.js

parjser.TopDownParserWithLookahead.js: parjser.core.js GrammarCompiler.js TopDownParser.js TopDownParserWithLookahead.js
	cat js/parjser.core.js tmp/parjser.GrammarCompiler.js tmp/parjser.TopDownParser.js tmp/parjser.TopDownParserWithLookahead.js > js/parjser.TopDownParserWithLookahead.js

SimpleTopDownParser-externs.js:
	cp source/parjser.SimpleTopDownParser-externs.js tmp/parjser.SimpleTopDownParser-externs.js

parjser.SimpleTopDownParser-min.js: parjser.SimpleTopDownParser.js SimpleTopDownParser-externs.js
	java -jar /usr/share/java/google-closure-compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js js/parjser.SimpleTopDownParser.js --js_output_file js/parjser.SimpleTopDownParser-min.js --externs tmp/parjser.SimpleTopDownParser-externs.js

TopDownParser-externs.js:
	cp source/parjser.TopDownParser-externs.js tmp/parjser.TopDownParser-externs.js

parjser.TopDownParser-min.js: parjser.TopDownParser.js TopDownParser-externs.js
	java -jar /usr/share/java/google-closure-compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js js/parjser.TopDownParser.js --js_output_file js/parjser.TopDownParser-min.js --externs tmp/parjser.TopDownParser-externs.js

TopDownParserWithLookahead-externs.js:
	cp source/parjser.TopDownParserWithLookahead-externs.js tmp/parjser.TopDownParserWithLookahead-externs.js

parjser.TopDownParserWithLookahead-min.js: parjser.TopDownParserWithLookahead.js TopDownParserWithLookahead-externs.js
	java -jar /usr/share/java/google-closure-compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js js/parjser.TopDownParserWithLookahead.js --js_output_file js/parjser.TopDownParserWithLookahead-min.js --externs tmp/parjser.TopDownParserWithLookahead-externs.js

