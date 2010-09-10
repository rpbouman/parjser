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

//see:
//http://msdn.microsoft.com/en-us/library/ms721196(VS.85).aspx
(function(){
            
parjser.grammars.mdx =
{
  ignoreCase: true,
  ignoreTokens: {
    whitespace: true
  },
  tokens: {
    whitespace: /\s+|--[^\n]*\n|\/\*([^*]|\*(?!\/))*\*\//,
    AFTER: /\bAFTER\b/,
    ALL: /\bALL\b/,
    AND: /\bAND\b/,
    AS: /\bAS\b/,
    ASC: /\bASC\b/,
    AXIS: /\bAXIS\b/,
    BASC: /\bBASC\b/,
    BDESC: /\bBDESC\b/,
    BEFORE: /\bBEFORE\b/,
    BEFORE_AND_AFTER: /\bBEFORE_AND_AFTER\b/,
    BOTTOMCOUNT: /\bBOTTOMCOUNT\b/,
    BOTTOMPERCENT: /\bBOTTOMPERCENT\b/,
    BOTTOMSUM: /\bBOTTOMSUM\b/,
    CHAPTERS: /\bCHAPTERS\b/,
    CHILDREN: /\bCHILDREN\b/,
    COLUMNS: /\bCOLUMNS\b/,
    CROSSJOIN: /\bCROSSJOIN\b/,
    CURRENTMEMBER: /\bCURRENTMEMBER\b/,
    DESC: /\bDESC\b/,
    DESCENDANTS: /\bDESCENDANTS\b/,
    DIMENSION: /\bDIMENSION\b/,
    DISTINCT: /\bDISTINCT\b/,
    DRILLDOWNLEVEL: /\bDRILLDOWNLEVEL\b/,
    DRILLDOWNLEVELBOTTOM: /\bDRILLDOWNLEVELBOTTOM\b/,
    DRILLDOWNLEVELTOP: /\bDRILLDOWNLEVELTOP\b/,
    DRILLDOWNMEMBER: /\bDRILLDOWNMEMBER\b/,
    DRILLDOWNMEMBERBOTTOM: /\bDRILLDOWNMEMBERBOTTOM\b/,
    DRILLDOWNMEMBERTOP: /\bDRILLDOWNMEMBERTOP\b/,
    DRILLUPLEVEL: /\bDRILLUPLEVEL\b/,
    DRILLUPMEMBER: /\bDRILLUPMEMBER\b/,
    EMPTY: /\bEMPTY\b/,
    EXCEPT: /\bEXCEPT\b/,
    EXTRACT: /\bEXTRACT\b/,
    FILTER: /\bFILTER\b/,
    FROM: /\bFROM\b/,
    GENERATE: /\bGENERATE\b/,
    HIERARCHIZE: /\bHIERARCHIZE\b/,
    HIERARCHY: /\bHIERARCHY\b/,
    INTERSECT: /\bINTERSECT\b/,
    ISEMPTY: /\bISEMPTY\b/,
    ITEM: /\bITEM\b/,
    LASTPERIODS: /\bLASTPERIODS\b/,
    LEVEL: /\bLEVEL\b/,
    LEVELS: /\bLEVELS\b/,
    MEMBER: /\bMEMBER\b/,
    MEMBERS: /\bMEMBER\b/,
    MTD: /\bMTD\b/,
    NON: /\bNON\b/,
    NOT: /\bNOT\b/,
    ON: /\bON\b/,
    OR: /\bOR\b/,
    ORDER: /\bORDER\b/,
    PAGES: /\bPAGES\b/,
    PERIODSTODATE: /\bPERIODSTODATE\b/,
    PROPERTIES: /\bPROPERTIES\b/,
    QTD: /\bQTD\b/,
    RECURSIVE: /\bRECURSIVE\b/,
    ROWS: /\bROWS\b/,
    SECTIONS: /\bSECTIONS\b/,
    SELECT: /\bSELECT\b/,
    SELF: /\bSELF\b/,
    SELF_AND_AFTER: /\bSELF_AND_AFTER\b/,
    SELF_AND_BEFORE: /\bSELF_AND_BEFORE\b/,
    SELF_BEFORE_AFTER: /\bSELF_BEFORE_AFTER\b/,
    SET: /\bSET\b/,
    TOGGLEDRILLSTATE: /\bTOGGLEDRILLSTATE\b/,
    TOPCOUNT: /\bTOPCOUNT\b/,
    TOPPERCENT: /\bTOPPERCENT\b/,
    TOPSUM: /\bTOPSUM\b/,
    UNION: /\bUNION\b/,
    WHERE: /\bWHERE\b/,
    WITH: /\bWITH\b/,
    WTD: /\bWTD\b/,
    XOR: /\bXOR\b/,
    YTD: /\bWTD\b/,
    number: /[\-+]?\d*\.?\d+([eE][\-+]?\d+)?/,
    regular_identifier: /[a-z][a-z0-9_]*/,
    delimited_identifier: /\[([^\]]|\]\])+\]/,
    comma: /\,/,
    dot: /\./,
    colon: /:/,
    lparen: /\(/,
    rparen: /\)/,
    lbrace: /\{/,
    rbrace: /\}/,
    comp_op: /\=|<>|<|>|<=|>=/,
    plusmin_op: /\+|\-/,
    asterisk: /\*/
  },
  rules: {
    search_condition: ["boolean_term", [["|", "OR", "XOR"], "search_condition"], "*"],
    boolean_term: ["boolean_factor", ["AND", "boolean_term"], "*"], 
    boolean_factor: ["NOT", "?", "boolean_primary"],
    boolean_primary: ["|",
        ["value_expr", "comp_op", "value_expr"],
        ["ISEMPTY", "lparen", "value_expr"],
        ["lparen", "search_condition", "rparen"]
    ],
    desc_flags: ["|",
        "SELF",
        "AFTER",
        "BEFORE",
        "BEFORE_AND_AFTER",
        "SELF_AND_AFTER",
        "SELF_AND_BEFORE",
        "SELF_BEFORE_AFTER" 
    ],
    numeric_value_expr: ["|",
        "number"
    ],   
    index: "numeric_value_expr",
    percentage: "percentage",
    level:["|",
        ["member", "dot", "LEVEL"],
        ["dim_hier", "dot", "LEVELS", "lparen", "number", "rparen"],
        ["dim_hier", "dot", "identifier"]
    ],
    hierarchy_name: ["|",
        ["member", "dot", "HIERARCHY"],
        ["level", "dot", "HIERARCHY"],
        "identifier"
    ],
    hierarchy: "hierarchy_name", 
    dimension_name: [
        ["member", "dot", "DIMENSION"],
        ["level", "dot", "DIMENSION"],
        ["hierarchy", "dot", "DIMENSION"],
        "identifier"
    ],
    dim_hier: ["|",
        ["cube_name", "dot", "dimension_name", "dot", "hierarchy_name"],
        ["cube_name", "dot", "dimension_name"],
        "dimension_name"
    ],
    property: ["|",
        ["dim_hier", "dot", "identifier"],
        ["level", "dot", "identifier"],
        ["member", "dot", "identifier"],
        "identifier"
    ],
    dim_props: [
        "DIMENSION","?", "PROPERTIES", 
        "property", ["comma", "property"], "*" 
    ],
    axis_name: ["|",
        "COLUMNS",
        "ROWS",
        "PAGES",
        "CHAPTERS",
        "SECTIONS",
        ["AXIS", "lparen", "number", "rparen"]
    ],
    axis_spec: [
        ["NON", "EMPTY"], "?",
        "set", 
        "dim_props", "?",
        "ON", "axis_name"
    ],
    identifier: ["|",
        "regular_identifier",
        "delimited_identifier"
    ],
    data_source: "identifier",
    catalog_name: "identifier",
    schema_name: "identifier",
    cube_name: ["|",
        ["data_source", "dot", "catalog_name", "dot", "schema_name", "dot", "identifier"],
        ["catalog_name", "dot", "schema_name", "dot", "identifier"],
        ["schema_name", "dot", "identifier"],
        "identifier"
    ],
    cube_spec: ["cube_name", ["comma", "cube_name"], "*"],
    member: ["|",
        ["identifier", ["dot", "member"], "*"]
    ],
    string_value_expr: [],
    string_value_expr_list: [
        "string_value_expr",
        ["comma", "string_value_expr"], "*"
    ],
    tuple_value_expression: ["|",
        ["set", "dot", "CURRENTMEMBER"],
        ["set", "dot", "ITEM",
            "lparen",
            ["|",
                "number",
                "string_value_expr_list"
            ],
            "rparen"
        ]
    ],
    set_or_tuple: ["|", "set", "tuple"],
    set_or_tuple_list: ["set_or_tuple", ["comma", "set_or_tuple"], "*"],
    set_value_expr: ["|",
        ["dim_hier", "dot", "MEMBERS"],
        ["level", "dot", "MEMBERS"],
        ["member", "dot", "CHILDREN"],
        ["BOTTOMCOUNT", "lparen", "set", "comma", "index", ["comma", "numeric_value_expr"], "?", "rparen"],
        ["BOTTOMPERCENT", "lparen", "set", "comma", "percentage", "comma", "numeric_value_expr", "rparen"],
        ["BOTTOMSUM", "lparen", "set", "comma", "numeric_value_expr", "comma", "numeric_value_expr", "rparen"],
        ["CROSSJOIN", "lparen", "set", "comma", "set", "rparen"],
        ["DESCENDANTS", "lparen", "member", "comma", "level", ["comma", "desc_flags"], "?", "rparen"],
        ["DISTINCT", "lparen", "set", "rparen"],
        ["DRILLDOWNLEVEL", "lparen", "set", ["comma", "level"], "?", "rparen"],
        ["DRILLDOWNLEVELBOTTOM", "lparen", "set", "comma", "index", [["comma", "level"], "?", "numeric_value_expr"],"?", "rparen"],
        ["DRILLDOWNLEVELTOP", "lparen", "set", "comma", "index", [["comma", "level"], "?", "numeric_value_expr"],"?", "rparen"],
        ["DRILLDOWNMEMBER", "lparen", "set", "comma", "set", ["comma", "RECURSIVE"], "?", "rparen"],
        ["DRILLDOWNMEMBERBOTTOM", "lparen", "set", "comma", "set", "number", ["comma", "numeric_value_expr", ["comma", "RECURSIVE"], "?"], "?", "rparen"],
        ["DRILLDOWNMEMBERTOP", "lparen", "set", "comma", "set", "index", ["comma", "numeric_value_expr", ["comma", "RECURSIVE"], "?"], "?", "rparen"],
        ["DRILLUPLEVEL", "lparen", "set", ["comma", "level"], "?", "rparen"],
        ["DRILLUPMEMBER", "lparen", "set", "comma", "set", "rparen"],
        ["EXCEPT", "lparen", "set", "comma", "set", ["comma", "ALL"], "?", "rparen"],
        ["EXTRACT", "lparen", "set", ["comma", "dim_hier"], "+", "rparen"],
        ["FILTER", "lparen", "set", "comma", "search_condition", "rparen"],
        ["GENERATE", "lparen", "set", "comma", "set", ["comma", "ALL"], "?", "rparen"],
        ["HIERARCHIZE", "lparen", "set", "comma"],
        ["INTERSECT", "lparen", "set", "comma", "set", ["comma", "ALL"], "?", "rparen"],
        ["LASTPERIODS", "lparen", "numeric_value_expr", ["comma", "member"], "?", "rparen"],
        ["MTD", "lparen", "member", "?", "rparen"],
        ["ORDER", "lparen", "set", "value_expr", ["comma", ["|", "ASC", "DESC", "BASC", "BDESC"]], "?", "rparen"],
        ["PERIODSTODATE", "lparen", "level", ["comma", "member"], "?", "rparen"],
        ["QTD", "lparen", "member", "?", "rparen"],
        ["TOGGLEDRILLSTATE", "lparen", "set", "comma", "set", ["comma", "RECURSIVE"], "?", "rparen"],
        ["TOPCOUNT", "lparen", "set", "comma", "index", ["comma", "numeric_value_expr"], "?", "rparen"],
        ["TOPPERCENT", "lparen", "set", "comma", "percentage", "comma", "numeric_value_expr", "rparen"],
        ["TOPSUM", "lparen", "set", "comma", "numeric_value_expr", "comma", "numeric_value_expr", "rparen"],
        ["UNION", "lparen", "set", "comma", "set", ["comma", "ALL"], "?", "rparen"],
        ["WTD", "lparen", "member", "?", "rparen"],
        ["YTD", "lparen", "member", "?", "rparen"]
    ],
    set_atom: ["|",
        ["member", "colon", "member"],
        "set_value_expr",
        ["lbrace", "set_or_tuple_list", "?", "rbrace"],
        ["lparen", "set", "rparen"]
    ],
    set_crossjoin: ["set_atom", ["asterisk", "set_atom"], "*"],
    set: ["set_crossjoin", ["plusmin_op", "set_crossjoin"], "*"],
    tuple: ["|",
        "member",
        ["lparen", "member", ["comma", "member"], "*", "rparen"],
        "tuple_value_expression"
    ], 
    slicer_spec: ["|", "set", "tuple"],
    member_name: ["|",
        "cube_name", "?", "member", "dot", "identifier"
    ],
    value_expr: [],
    cell_props: [],
    solve_order_spec: [],
    member_property_def: [],
    member_spec: [
        "MEMBER", "member_name", "AS", "value_expr",
        "solve_order_spec", "?",
        "member_property_def", "*" 
    ],
    set_name : ["|",
        "identifier",
        ["cube_name", "dot", "identifier"]
    ],
    set_spec: ["SET", "set_name", "AS", "set"],
    formula_spec: ["|", "member_spec", "set_spec"],
    select_stmt: [
      ["WITH", "formula_spec", "+"], "?",
      "SELECT", [
        "axis_spec", ["comma", "axis_spec"], "*"
      ], "?",
      "FROM", "cube_spec", "?",
      ["WHERE", "slicer_spec", "?"], "?",
      "cell_props", "?"
    ],
    create_formula_stmt: [
    ],
    drop_formula_stmt: [
    ],
    mdx_stmt: ["|",
      "select_stmt",
      "create_formula_stmt",
      "drop_formula_stmt"
    ]
  },
  startSymbol: "mdx_stmt"
}
;        
}())
