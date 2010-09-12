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

(function(){
            
parjser.grammars.arithmetic =
{
  startSymbol: "calculation",
  ignoreTokens: {"whitespace": true},
  tokens: {
    whitespace: /\s+|--[^\n]*\n|\/\*([^*]|\*(?!\/))*\*\//,
    number: /\d*\.?\d+([eE][\-+]?\d+)?/,
    addsub_operator: /[\+\-]/,
    muldiv_operator: /[\*\/]/,
    exp_operator: /\^/,
    lparen: /\(/,
    rparen: /\)/
  },
  rules: {
    atom: ["|",
      ["lparen", "calculation", "rparen"],
      "number"
    ],
    calculation: ["|",
      "addsub",
      "atom"
    ],
    addsub: [
      "addsub_operand", 
      ["addsub_operator", "addsub_operand"], "*"
    ],
    addsub_operand: [
      "muldiv_operand",
      ["muldiv_operator", "muldiv_operand"], "*"
    ],
    muldiv_operand: [
      "exp_operand",
      ["exp_operator", "exp_operand"], "*"
    ],
    "exp_operand": ["addsub_operator", "?", "atom"]
 }
};

}());
