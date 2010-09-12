js/parjser.core.js: source/parjser.js source/parjser.Exception.js source/parjser.RegexTokenizer.js
	cat source/parjser.js source/parjser.Exception.js source/parjser.RegexTokenizer.js > js/parjser.core.js

js/parjser.SimpleTopDownParser.js: js/parjser.core.js source/parjser.SimpleTopDownParser.js
	cat js/parjser.core.js source/parjser.SimpleTopDownParser.js > js/parjser.SimpleTopDownParser.js

js/parjser.SimpleTopDownParser-min.js: js/parjser.SimpleTopDownParser.js
	java -jar /usr/share/java/google-closure-compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js js/parjser.SimpleTopDownParser.js --js_output_file js/parjser.SimpleTopDownParser-min.js 

js/parjser.TopDownParser.js: js/parjser.core.js source/parjser.GrammarCompiler.js source/parjser.TopDownParser.js
	cat js/parjser.core.js source/parjser.GrammarCompiler.js source/parjser.TopDownParser.js > js/parjser.TopDownParser.js

js/parjser.TopDownParser-min.js: js/parjser.TopDownParser.js
	java -jar /usr/share/java/google-closure-compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js js/parjser.TopDownParser.js --js_output_file js/parjser.TopDownParser-min.js

js/parjser.TopDownParserWithLookahead.js: js/parjser.TopDownParser.js source/parjser.TopDownParserWithLookahead.js
	cat js/parjser.TopDownParser.js source/parjser.TopDownParserWithLookahead.js > js/parjser.TopDownParserWithLookahead.js

js/parjser.TopDownParserWithLookahead-min.js: js/parjser.TopDownParserWithLookahead.js
	java -jar /usr/share/java/google-closure-compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js js/parjser.TopDownParserWithLookahead.js --js_output_file js/parjser.TopDownParserWithLookahead-min.js 

js/parjser.grammars.sqlite.js:
	cp source/parjser.grammars.sqlite.js js/parjser.grammars.sqlite.js

js/parjser.grammars.sqlite-min.js: js/parjser.grammars.sqlite.js
	java -jar /usr/share/java/google-closure-compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js js/parjser.grammars.sqlite.js --js_output_file js/parjser.grammars.sqlite-min.js 

js/parjser.grammars.arithmetic.js:
	cp source/parjser.grammars.arithmetic.js js/parjser.grammars.arithmetic.js

js/parjser.grammars.arithmetic-min.js: js/parjser.grammars.arithmetic.js 
	java -jar /usr/share/java/google-closure-compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js js/parjser.grammars.arithmetic.js --js_output_file js/parjser.grammars.arithmetic-min.js 

js/parjser.grammars.js: js/parjser.grammars.arithmetic.js js/parjser.grammars.sqlite.js
	cat  js/parjser.grammars.arithmetic.js js/parjser.grammars.sqlite.js > js/parjser.grammars.js

js/parjser.grammars-min.js: js/parjser.grammars.js
	java -jar /usr/share/java/google-closure-compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js js/parjser.grammars.js --js_output_file js/parjser.grammars-min.js 
 
js/parjser.js: js/parjser.SimpleTopDownParser.js source/parjser.GrammarCompiler.js source/parjser.TopDownParser.js source/parjser.TopDownParserWithLookahead.js
	cat js/parjser.SimpleTopDownParser.js source/parjser.GrammarCompiler.js source/parjser.TopDownParser.js source/parjser.TopDownParserWithLookahead.js > js/parjser.js

js/parjser-min.js: js/parjser.js
	java -jar /usr/share/java/google-closure-compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js js/parjser.js --js_output_file js/parjser-min.js 	

parjser.zip: examples/example-utils.js examples/ParjserPlayground.html js/parjser-min.js js/parjser.grammars-min.js js/parjser.TopDownParser.js js/parjser.TopDownParserWithLookahead.js js/parjser.TopDownParser-min.js js/parjser.TopDownParserWithLookahead-min.js 
	zip parjser.zip source/* js/* examples/* lib/*

	

