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

//see: http://partmaps.org/era/unix/shell.html

(function(){

parjser.grammars.bash = {
  ignoreCase: false,
  ignoreTokens: {
    "blank": true
  },
  startSymbol: "command_list",
  tokens: {
    blank: /[ \t]+/,
    digit: /\d/,
    ampamp: /&&/,
    file1: /&\d/,
    file2: /&-/,
    pipepipe: /\|\|/,
    semisemi: /;;/,
    semi: /;/,
    amp: /&/,
    pipe: /\|/,
    lparen: /\(/,
    rparen: /\)/,
    lcurly: /\{/,
    rcurly: /\}/,
    equals: /\=/,
    ltltgtgt: /<<|>>/,
    ltgt: /[<>]/,
    single_quoted: /'[^']*'/,
    double_quoted: /"([^"]|\\["`$\\])*"/,
    grave_quoted: /`([^`]|\\`)`/,
    "case": /case/,
    "do": /do/,
    "done": /done/,
    "elif": /elif/,
    "else": /else/,
    "esac": /esac/,
    "fi": /fi/,
    "for": /for/,
    "if": /if/,
    "in": /in/,
    "then": /then/,
    "until": /until/,
    "while": /while/,
    variable: /$[A-Za-z]\w*/,
    name: /[A-Za-z]\w*/,
    word: /([^ \t]|\\[\\|'"`$])+/,
  },
  rules: {
    nameword: ["|", "name", "word"],
    assignment: ["nameword", "equals", "name"],
    redirect: ["|",
      ["ltgt", "file"],
      ["ltltgtgt", "nameword"]
    ],
    file: ["|", "file1", "file2", "nameword"],
    item: ["|", "redirect", "assignment", "nameword"],
    simple_command: ["item", "+"],
    doblock: ["do", "command_list", "done"],
    subshell: ["lparen", "command_list", "rparen"],
    groupcommand: ["lcurly", "command_list", "rcurly"],
    fordocommand: ["for", "name", "doblock"],
    forincommand: ["for", "name", "in", "nameword", "+", "doblock"],
    whilecommand: ["while", "command_list", "doblock"],
    untilcommand: ["until", "command_list", "doblock"],
    casepart: ["pattern", "rparen", "command_list", "semisemi"],
    casecommand: ["case", "nameword", "in", "casepart", "+", "esac"],
    ifcommand: [
      "if", "command_list", "then", "command_list",
      "elifpart", "*",
      "elsepart", "?",
      "fi"
    ],
    elifpart: ["elif", "command_list", "then", "command_list"],
    elsepart: ["else", "command_list"],
    command: ["|",
      "simple_command",
      "subshell",
      "groupcommand",
      "fordocommand",
      "forincommand",
      "whilecommand",
      "untilcommand",
      "casecommand",
      "ifcommand"
    ],
    pattern: ["nameword", ["pipe", "nameword"], "*"],
    pipeline: ["command", ["pipe", "pipeline"], "*"],
    list1: ["pipeline", ["list1_separator", "list1"], "*"],
    list1_separator: ["|", "ampamp", "pipepipe"],
    command_list: [
      "list1",
      ["command_list_separator", "command_list"], "*",
      "command_list_separator", "?"
    ],
    command_list_separator: ["|", "amp", "semi"]
  }
}

})();
