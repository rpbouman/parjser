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

(function() {

parjser.BufferedTokenizer = function(conf){
    this.init(conf);
    return this;
};

parjser.BufferedTokenizer.prototype = {
    init: function(conf) {
      this.buffer = [];
      tokenizer = conf.tokenizer;
      switch(typeof(tokenizer)){
        case "function":
          tokenizer = new tokenizer(conf);
          break;
        case "object":
          if (tokenizer !== null) break;
        default:
          throw "No valid tokenizer";
      }
      this.tokenizer = tokenizer;
      this.tokenBufferIndex = 0;
    },
    setText: function(text) {
      var buffer = this.buffer;
      buffer.length = 0;
      this.tokenBufferIndex = 0;
      var tokenizer = this.tokenizer;
      tokenizer.setText(text);
      tokenizer.tokenize(this.buffer);
    },
    nextToken: function() {
      var buffer = this.buffer;
      return (this.tokenBufferIndex < buffer.length) ? buffer[this.tokenBufferIndex++] : parjser._EOF;
    }
};

}());
