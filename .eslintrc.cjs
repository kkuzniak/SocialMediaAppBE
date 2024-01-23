module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['import', '@typescript-eslint', 'prettier'],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ['airbnb', 'airbnb-typescript', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 9,
    sourceType: 'module',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
  },
  rules: {
    /** these rules we won"t turn on and this will not change after the "initial" period **/
    'implicit-arrow-linebreak': 'off', // allow newline after =>
    'function-paren-newline': 'off', // allow function parenthesis on same line
    // allow objects to be defined in one line
    // (we might want to turn this on if we decide we no longer
    // need Prettier: https://gitlab.com/neuroflow1/webapp/-/merge_requests/3728#note_684734026)
    'object-curly-newline': 'off',
    'operator-linebreak': 'off', // allow linebreaks before or after equal sign
    'import/no-cycle': 'off', // we have a huge number of circular dependencies, no need to highlight everything in red!
    'import/prefer-default-export': 'off', // allow a file to have a single named export
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off', // allow anything to happen in promise.reject
    '@typescript-eslint/no-unused-vars': 'off', // do not allow variables which are not used anywhere
    'object-shorthand': 'off',
    'no-underscore-dangle': 'off', // disallow dangling underscores in identifiers

    /** these are our own custom rules **/
    '@typescript-eslint/indent': ['error', 2], // enforcing consistent indentation
    'newline-per-chained-call': 'error', // requiring a newline after each call in a method chain
    'import/order': [
      // allow eslint to handle import order
      // extrenal modules first
      // [newline]
      // absolute imports - any modules imported starting with "../" or absolute imports
      // [newline]
      // relative imports - all imports starting with "./"
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['sibling', 'parent']],
        'newlines-between': 'always',
      },
    ],
    'import/extensions': ['error', 'always'],
    // error on any indentation which is not multiples of 4 spaces
    indent: 'off', // turn off classic eslint rule as it conflicts with typescript one
    // always wrap strings in single quotes
    quotes: 'off', // turn off classic eslint rule as it conflicts with typescript one
    'nonblock-statement-body-position': ['error', 'below'], // enforce the location of single-line statements
    '@typescript-eslint/quotes': ['error', 'single'],
    // no forcing to use parentheses around arrow function arguments only if there is more than one argument
    'arrow-parens': ['error', 'as-needed'],
    // always require a curly brace after if/while
    curly: 'error',
    // this will make ESLint complain if function is not a function declaration (const someFunc = () => {})
    // which is something we should encourage but most of our functions are currently defined as expressions so it highlights a lot of issues
    // maybe we can enable this at some point?
    // "func-style": ["warn", "expression"],
    'func-names': ['warn', 'as-needed'],
    'no-trailing-spaces': 'error',

    /** These rules are set to `warn` to suppress the default `error` value they have so once each is resolved we should remove the specific rule  **/
    '@typescript-eslint/naming-convention': 'warn', // only allow variable naming following camelCase, PascalCase, UPPER_CASE
    '@typescript-eslint/no-loop-func': 'warn', // disallow functions creation inside of loops
    '@typescript-eslint/no-redeclare': 'warn', // disallow re-declartion of variables with var (example: var x = 1; var x = 2)
    '@typescript-eslint/no-shadow': 'warn', // disallow varabile creation if name is one of restricted ones (NaN, Infinity, undefined, eval)
    '@typescript-eslint/no-unused-expressions': 'warn', // disallow expressions where these are unexpected
    '@typescript-eslint/no-use-before-define': ['warn', { functions: false }], // do not allow variables to be used before they are defined
    '@typescript-eslint/object-curly-spacing': 'warn', // enforce space before closing curly brace and after opening curly brace
    '@typescript-eslint/semi': 'error', // enforce semicolon at certain places
    '@typescript-eslint/space-infix-ops': 'warn', // expect space before and after equals sign
    'array-callback-return': 'warn', // each array loop-like method expecing return value should return one (map, filter ...)
    'block-scoped-var': 'warn', // warn if variable defined with "var" is used outside of a block in which it was defined
    'class-methods-use-this': 'warn', // make sure "this" is used in every non-static class method
    'consistent-return': 'warn', // if function return a value in one logical branch it should return a value in all other branches as well
    'guard-for-in': 'warn', // the body of a for-in should be wrapped in an if statement to filter unwanted properties from the prototype
    'import/no-duplicates': ['warn', { considerQueryString: true }], // allow only single import of module in a file
    'import/no-mutable-exports': 'warn', // disallow exporting variables defined with "let" from a module
    'import/no-named-as-default': 'warn', // do not allow to define default import with name which is also a named export
    'import/no-named-as-default-member': 'warn', // prefer import of named exports instead of importing the whole module
    'import/no-self-import': 'warn', // disallow module from importing itself
    'max-classes-per-file': 'warn', // allow a maximum one class definition per file
    'no-cond-assign': 'warn', // disallow assignment operators in conditional statements (if (aaa = x) is obviously an error)
    'no-else-return': 'warn', // disallow useless else
    'no-empty': 'warn', // disallow empty block statements
    'no-empty-pattern': 'warn', // disallow empty destructuring patterns
    'no-multi-assign': 'warn', // disallow Use of Chained Assignment Expressions
    'no-nested-ternary': 'warn', // disallow nested ternary expressions
    'no-param-reassign': 'warn', // disallow reassignment of function parameters
    'no-plusplus': 'warn', // disallow the unary operators ++ and --
    'no-prototype-builtins': 'warn', // disallow use of Object.prototypes builtins directly
    'no-restricted-globals': 'warn', // disallow specific global variables like "event"
    'no-restricted-properties': 'warn', // disallow certain object properties (like Math.pow should be **)
    'no-restricted-syntax': 'warn', // disallow specific syntax (like "for..in loops")
    'no-return-assign': 'warn', // disallow assignment in return statement
    'no-sequences': 'warn', // disallow use of the comma operator in certain cases
    'no-undef': 'warn', // disallow use of undeclared variables
    'no-unreachable': 'warn', // disallow unreachable code after return, throw, continue, and break statements
    'no-useless-concat': 'warn', // disallow unnecessary concatenation of strings
    'no-useless-escape': 'warn', // disallow unnecessary escape usage
    'no-var': 'warn', // require let or const instead of var
    'no-void': 'warn', // disallow use of the void operator
    'no-floating-decimal': 'warn', // do not use decimal points without preceeding 0: .5 - wrong, 0.5 - good
    'operator-assignment': 'warn', // replace "x = x + 1" with "x += 1" and similar
    'prefer-const': 'warn', // suggest using const when variable is not reassigned
    'prefer-destructuring': 'warn', // prefer destructuring from arrays and objects (instead of "var foo = object.bar" do "var { bar: foo } = object;")
    'prefer-rest-params': 'warn', // suggest using the rest parameters instead of arguments
    'template-curly-spacing': 'warn', // enforce usage of spacing in template strings
    'valid-typeof': 'warn', // enforce comparing typeof expressions against valid strings
    'vars-on-top': 'warn', // require variable declarations to be at the top of their scope
    'comma-dangle': ['warn', 'always-multiline'],
  },
};
