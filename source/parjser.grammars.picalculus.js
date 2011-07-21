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
            
parjser.grammars.picalculus =
{
  startSymbol: "choice",
  ignoreTokens: {"whitespace":true},
  tokens:  {
    whitespace: /\s+/,
    replication_operator: /!/,
    choice_operator: /\+/,
    parallel_operator: /\|/,
    sequence_operator: /\./,
    lparen: /\(/,
    rparen: /\)/,
    lt: /</,
    gt: />/,
    name: /[A-Za-z]+\d*/,
    comma: /,/,
    empty: /0/
  },
  rules:  {
    choice: ["choice_operand",["choice_operator","choice_operand"],"*"],
    choice_operand: ["parallel_operand",["parallel_operator","parallel_operand"],"*"],
    parallel_operand: ["sequence_operand",["sequence_operator","sequence_operand"],"*"],
    sequence_operand: ["|", "empty", ["replication_operator", "?", "name",["|","send","receive"],"?"]],
    send: ["lt","names","gt"],
    receive: ["lparen","names","rparen"],
    names: ["name",["comma","name"],"*"]
  }
};

}());
