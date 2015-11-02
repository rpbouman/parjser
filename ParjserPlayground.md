# Introduction #

The parjser project provides an example webpage that lets you see parjser in action without doing any actual programming. This page is called `ParjserPlayground.html` and you can find it in the `examples` directory beneath the parjser project directory.

# Running ParjserPlayground.html #

You can open the `ParjserPlayground.html` page directly in your webbrowser. The page can run offline, so you don't have to make it accessible via a webserver (although you can if you like).

# Working with ParjserPlayground #

The `ParjserPlayground.html` webpage provides on-screen instructions, which are visible after opening the page in your web browser. For completeness, we repeat the instructions below:

  1. Type a grammar in the "Configuration" textarea on the left-hand side of the page, or choose one of the pre-defined grammars from the "Grammar" listbox.
  1. Choose one of the parsers using the "Parser" listbox. All parsers provided by parjser should return the same parse tree, but some may perform better than others (depending upon your grammar).
  1. Type the text you want to parse in the "Input" textarea on the right-hand side of the page.
  1. Press the "Parse" button. If the parse succeeds, the parse tree will be shown below the input textarea. You can expand and collapse the nodes in the parse tree by clicking on the + or - toggle. You can control the depth of the parse tree to some extent with the "Prune" checkbox. When checked, the tree will attempt to make the branches of the parse tree as shallow as possible by omitting nodes that have exactly one child node. The "Prune" checkbox is respected by the TopDownParser and TopDownParserWithLookahead, but not by the SimpleTopDownParser. If the parse fails, an alert should pop up, indicating the location and nature of the error.


