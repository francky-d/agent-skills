/**
 * Tiny multi-language syntax highlighter. Wraps tokens in spans:
 *   .kw .ty .st .cm .vr .fn .nu .op .tg
 *
 * For each language we define a list of regex rules. The first match wins.
 * Output is HTML-safe: the text is escaped before tokens are inserted.
 */

const LANGUAGES = {
  js: jsRules(),
  ts: jsRules({ typescript: true }),
  typescript: jsRules({ typescript: true }),
  jsx: jsRules({ jsx: true }),
  tsx: jsRules({ typescript: true, jsx: true }),
  python: pythonRules(),
  py: pythonRules(),
  bash: bashRules(),
  sh: bashRules(),
  shell: bashRules(),
  docker: dockerRules(),
  dockerfile: dockerRules(),
  yaml: yamlRules(),
  yml: yamlRules(),
  json: jsonRules(),
  html: htmlRules(),
  vue: vueRules(),
  css: cssRules(),
  sql: sqlRules(),
  go: goRules(),
  golang: goRules(),
  php: phpRules(),
  ini: iniRules(),
  toml: iniRules(),
  hcl: hclRules(),
  terraform: hclRules(),
  tf: hclRules(),
  blade: bladeRules(),
  twig: twigRules(),
  sshconfig: sshConfigRules(),
  'ssh-config': sshConfigRules(),
  helm: helmRules(),
  gotmpl: helmRules(),
  'go-template': helmRules(),
  nginx: nginxRules(),
  conf: nginxRules(),
  c: cRules(),
  cpp: cRules({ cpp: true }),
  'c++': cRules({ cpp: true }),
};

export function highlight(code, lang) {
  const rules = LANGUAGES[(lang || '').toLowerCase()];
  if (!rules) return escapeHtml(code);
  return tokenize(code, rules);
}

function tokenize(input, rules) {
  let result = '';
  let i = 0;
  const len = input.length;

  outer: while (i < len) {
    for (const { regex, cls } of rules) {
      regex.lastIndex = i;
      const m = regex.exec(input);
      if (m && m.index === i) {
        const text = m[0];
        result += cls
          ? `<span class="${cls}">${escapeHtml(text)}</span>`
          : escapeHtml(text);
        i += text.length;
        continue outer;
      }
    }
    result += escapeHtml(input[i]);
    i += 1;
  }
  return result;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// -- Languages -----------------------------------------------------------

function jsRules({ typescript = false, jsx = false } = {}) {
  const baseKw = [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'do', 'switch', 'case', 'default', 'break', 'continue', 'class', 'extends',
    'new', 'this', 'super', 'import', 'from', 'export', 'async', 'await',
    'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of',
    'true', 'false', 'null', 'undefined', 'void', 'yield',
  ];
  const tsKw = typescript
    ? ['interface', 'type', 'enum', 'as', 'implements', 'public', 'private', 'protected', 'readonly', 'declare', 'namespace']
    : [];
  const types = ['string', 'number', 'boolean', 'any', 'unknown', 'never', 'object', 'symbol', 'bigint', 'Promise', 'Array', 'Record'];

  return [
    { regex: /\/\/[^\n]*/g, cls: 'cm' },
    { regex: /\/\*[\s\S]*?\*\//g, cls: 'cm' },
    { regex: /`(?:\\.|\$\{[^}]*\}|[^`\\])*`/g, cls: 'st' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    { regex: new RegExp(`\\b(${[...baseKw, ...tsKw].join('|')})\\b`, 'g'), cls: 'kw' },
    { regex: new RegExp(`\\b(${types.join('|')})\\b`, 'g'), cls: 'ty' },
    { regex: /\b\d[\d_.]*\b/g, cls: 'nu' },
    { regex: /\b([A-Z][A-Za-z0-9_]*)\b/g, cls: 'ty' },
    { regex: /\b([a-z_$][\w$]*)\s*(?=\()/g, cls: 'fn' },
    { regex: /[+\-*/%=<>!&|^~?:]+/g, cls: 'op' },
  ];
}

function pythonRules() {
  const kw = ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or', 'is',
    'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'yield', 'lambda', 'pass', 'break',
    'continue', 'global', 'nonlocal', 'True', 'False', 'None', 'async', 'await', 'self'];
  const types = ['int', 'str', 'float', 'bool', 'list', 'dict', 'tuple', 'set', 'bytes', 'object', 'Optional', 'List', 'Dict', 'Tuple'];
  return [
    { regex: /#[^\n]*/g, cls: 'cm' },
    { regex: /"""[\s\S]*?"""/g, cls: 'st' },
    { regex: /'''[\s\S]*?'''/g, cls: 'st' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    { regex: new RegExp(`\\b(${kw.join('|')})\\b`, 'g'), cls: 'kw' },
    { regex: new RegExp(`\\b(${types.join('|')})\\b`, 'g'), cls: 'ty' },
    { regex: /@[A-Za-z_]\w*/g, cls: 'fn' },
    { regex: /\b\d[\d_.]*\b/g, cls: 'nu' },
    { regex: /\b([A-Z][A-Za-z0-9_]*)\b/g, cls: 'ty' },
    { regex: /\b([a-z_]\w*)\s*(?=\()/g, cls: 'fn' },
    { regex: /[+\-*/%=<>!&|^~]+/g, cls: 'op' },
  ];
}

function bashRules() {
  return [
    { regex: /#[^\n]*/g, cls: 'cm' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    { regex: /\$\w+|\$\{[^}]+\}/g, cls: 'vr' },
    { regex: /\b(if|then|else|fi|for|while|do|done|case|esac|in|function|return|export|local|echo|cd|exit)\b/g, cls: 'kw' },
    { regex: /\b\d+\b/g, cls: 'nu' },
    { regex: /^\s*[a-zA-Z_][\w-]*(?=\s)/gm, cls: 'fn' },
  ];
}

function dockerRules() {
  return [
    { regex: /#[^\n]*/g, cls: 'cm' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    { regex: /^\s*(FROM|RUN|CMD|ENTRYPOINT|COPY|ADD|WORKDIR|EXPOSE|ENV|ARG|VOLUME|USER|LABEL|HEALTHCHECK|SHELL|ONBUILD|STOPSIGNAL)\b/gm, cls: 'kw' },
    { regex: /\$\{?[\w.]+\}?/g, cls: 'vr' },
    { regex: /\b\d+\b/g, cls: 'nu' },
  ];
}

function yamlRules() {
  return [
    { regex: /#[^\n]*/g, cls: 'cm' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    { regex: /^\s*[\w.-]+(?=\s*:)/gm, cls: 'tg' },
    { regex: /\b(true|false|null|yes|no)\b/g, cls: 'kw' },
    { regex: /\b\d+(?:\.\d+)?\b/g, cls: 'nu' },
  ];
}

function jsonRules() {
  return [
    { regex: /"[^"]*"(?=\s*:)/g, cls: 'tg' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /\b(true|false|null)\b/g, cls: 'kw' },
    { regex: /-?\b\d+(?:\.\d+)?\b/g, cls: 'nu' },
  ];
}

function htmlRules() {
  return [
    { regex: /<!--[\s\S]*?-->/g, cls: 'cm' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    { regex: /<\/?[\w-]+/g, cls: 'tg' },
    { regex: /[\w-]+(?==)/g, cls: 'vr' },
    { regex: /\/?>/g, cls: 'tg' },
  ];
}

// Vue Single-File Components are a hybrid: HTML-like structure on the outside,
// TypeScript inside <script>, CSS inside <style>. The tokenizer is single-pass,
// so we merge rule sets — HTML structural cues first (so '</script>' is not
// eaten by the JS '<' operator), then TS keywords/types/strings.
function vueRules() {
  const tsKw = [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'do', 'switch', 'case', 'default', 'break', 'continue', 'class', 'extends',
    'new', 'this', 'super', 'import', 'from', 'export', 'async', 'await',
    'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of',
    'true', 'false', 'null', 'undefined', 'void', 'yield',
    'interface', 'type', 'enum', 'as', 'implements', 'public', 'private',
    'protected', 'readonly', 'declare', 'namespace',
  ];
  const types = ['string', 'number', 'boolean', 'any', 'unknown', 'never',
    'object', 'symbol', 'bigint', 'Promise', 'Array', 'Record', 'Ref', 'ComputedRef'];

  return [
    // Comments — HTML and JS forms
    { regex: /<!--[\s\S]*?-->/g, cls: 'cm' },
    { regex: /\/\/[^\n]*/g, cls: 'cm' },
    { regex: /\/\*[\s\S]*?\*\//g, cls: 'cm' },

    // Strings — template literals, double, single
    { regex: /`(?:\\.|\$\{[^}]*\}|[^`\\])*`/g, cls: 'st' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },

    // HTML/Vue tags — must come before the JS '<' operator rule.
    // Lowercase or PascalCase tag names; hyphenated allowed (e.g. <my-comp>).
    { regex: /<\/?[A-Za-z][\w-]*/g, cls: 'tg' },
    // Vue directives (v-if, @click, :prop) and plain HTML attributes before '='
    { regex: /(?:[@:]|v-)?[A-Za-z][\w-]*(?==)/g, cls: 'vr' },
    { regex: /\/?>/g, cls: 'tg' },

    // TypeScript keywords + types
    { regex: new RegExp(`\\b(${tsKw.join('|')})\\b`, 'g'), cls: 'kw' },
    { regex: new RegExp(`\\b(${types.join('|')})\\b`, 'g'), cls: 'ty' },

    // Numbers, type identifiers (PascalCase), function calls
    { regex: /\b\d[\d_.]*\b/g, cls: 'nu' },
    { regex: /\b([A-Z][A-Za-z0-9_]*)\b/g, cls: 'ty' },
    { regex: /\b([a-z_$][\w$]*)\s*(?=\()/g, cls: 'fn' },

    // Operators — last
    { regex: /[+\-*/%=<>!&|^~?:]+/g, cls: 'op' },
  ];
}

function cssRules() {
  return [
    { regex: /\/\*[\s\S]*?\*\//g, cls: 'cm' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    { regex: /[a-z-]+(?=\s*:)/gi, cls: 'vr' },
    { regex: /#[A-Fa-f0-9]+\b/g, cls: 'nu' },
    { regex: /\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|deg)?\b/g, cls: 'nu' },
    { regex: /[.#][\w-]+/g, cls: 'fn' },
    { regex: /@[\w-]+/g, cls: 'kw' },
  ];
}

function sqlRules() {
  const kw = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'TABLE', 'DROP', 'ALTER', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'GROUP',
    'BY', 'ORDER', 'LIMIT', 'OFFSET', 'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS',
    'NULL', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'INDEX', 'UNIQUE', 'DEFAULT'];
  return [
    { regex: /--[^\n]*/g, cls: 'cm' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    { regex: new RegExp(`\\b(${kw.join('|')})\\b`, 'gi'), cls: 'kw' },
    { regex: /\b\d+\b/g, cls: 'nu' },
  ];
}

function goRules() {
  const kw = [
    'break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else',
    'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import', 'interface',
    'map', 'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'var',
    'true', 'false', 'nil', 'iota',
  ];
  const types = [
    'bool', 'byte', 'complex64', 'complex128', 'error', 'float32', 'float64',
    'int', 'int8', 'int16', 'int32', 'int64', 'rune', 'string',
    'uint', 'uint8', 'uint16', 'uint32', 'uint64', 'uintptr', 'any',
  ];
  const builtins = ['append', 'cap', 'close', 'complex', 'copy', 'delete', 'imag',
    'len', 'make', 'new', 'panic', 'print', 'println', 'real', 'recover'];
  return [
    { regex: /\/\/[^\n]*/g, cls: 'cm' },
    { regex: /\/\*[\s\S]*?\*\//g, cls: 'cm' },
    // Backtick raw string (and Go struct tags) — multiline-safe.
    { regex: /`[^`]*`/g, cls: 'st' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    // Rune literal: 'x', '\n', 'ÿ'
    { regex: /'(?:\\(?:[abfnrtv\\'"]|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})|[^'\\])'/g, cls: 'st' },
    { regex: new RegExp(`\\b(${kw.join('|')})\\b`, 'g'), cls: 'kw' },
    { regex: new RegExp(`\\b(${types.join('|')})\\b`, 'g'), cls: 'ty' },
    { regex: new RegExp(`\\b(${builtins.join('|')})\\b(?=\\()`, 'g'), cls: 'fn' },
    { regex: /\b0[xX][0-9A-Fa-f_]+\b/g, cls: 'nu' },
    { regex: /\b\d[\d_.]*\b/g, cls: 'nu' },
    { regex: /\b([A-Z][A-Za-z0-9_]*)\b/g, cls: 'ty' },
    { regex: /\b([a-z_][\w]*)\s*(?=\()/g, cls: 'fn' },
    { regex: /[+\-*/%=<>!&|^~?:]+/g, cls: 'op' },
  ];
}

function cRules({ cpp = false } = {}) {
  const kw = [
    'auto', 'break', 'case', 'continue', 'default', 'do', 'else',
    'enum', 'extern', 'for', 'goto', 'if', 'inline', 'register', 'restrict',
    'return', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union',
    'volatile', 'while', '_Alignas', '_Alignof', '_Atomic', '_Bool',
    '_Complex', '_Generic', '_Imaginary', '_Noreturn', '_Static_assert',
    '_Thread_local', 'NULL', 'true', 'false',
    ...(cpp ? [
      'class', 'namespace', 'template', 'typename', 'public', 'private',
      'protected', 'virtual', 'override', 'final', 'new', 'delete', 'this',
      'try', 'catch', 'throw', 'using', 'nullptr', 'constexpr', 'noexcept',
      'explicit', 'friend', 'mutable', 'operator', 'and', 'or', 'not', 'xor',
      'co_await', 'co_return', 'co_yield',
    ] : []),
  ];
  const types = [
    'bool', 'char', 'const', 'double', 'float', 'int', 'long', 'short',
    'signed', 'unsigned', 'void', 'size_t', 'ssize_t', 'ptrdiff_t',
    'int8_t', 'int16_t', 'int32_t', 'int64_t',
    'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t',
    'intptr_t', 'uintptr_t', 'FILE',
    ...(cpp ? ['string', 'wstring', 'vector', 'map', 'unordered_map', 'set',
      'unordered_set', 'pair', 'tuple', 'array', 'auto'] : []),
  ];
  const builtins = [
    'malloc', 'calloc', 'realloc', 'free', 'memcpy', 'memmove', 'memset',
    'memcmp', 'strlen', 'strcmp', 'strncmp', 'strcpy', 'strncpy', 'strcat',
    'strncat', 'strchr', 'strstr', 'printf', 'fprintf', 'sprintf', 'snprintf',
    'scanf', 'fscanf', 'sscanf', 'puts', 'fputs', 'fopen', 'fclose', 'fread',
    'fwrite', 'fgets', 'fgetc', 'fputc', 'getchar', 'putchar', 'exit', 'abort',
    'assert', 'qsort', 'bsearch', 'abs', 'labs', 'atoi', 'atol', 'atof',
  ];
  return [
    { regex: /\/\/[^\n]*/g, cls: 'cm' },
    { regex: /\/\*[\s\S]*?\*\//g, cls: 'cm' },
    // Preprocessor directives — whole line styled as variable color.
    { regex: /^[ \t]*#[ \t]*\w+[^\n]*/gm, cls: 'vr' },
    { regex: /"(?:\\.|[^"\\\n])*"/g, cls: 'st' },
    { regex: /'(?:\\(?:[abfnrtv\\'"?0]|x[0-9A-Fa-f]+|[0-7]{1,3})|[^'\\\n])'/g, cls: 'st' },
    { regex: new RegExp(`\\b(${kw.join('|')})\\b`, 'g'), cls: 'kw' },
    { regex: new RegExp(`\\b(${types.join('|')})\\b`, 'g'), cls: 'ty' },
    { regex: new RegExp(`\\b(${builtins.join('|')})\\b(?=\\()`, 'g'), cls: 'fn' },
    { regex: /\b0[xX][0-9A-Fa-f']+(?:[uUlL]{0,3})\b/g, cls: 'nu' },
    { regex: /\b\d[\d.']*(?:[eE][+-]?\d+)?(?:[fFlLuU]{0,3})\b/g, cls: 'nu' },
    // Type-like identifiers ending in _t (size_t, my_struct_t)
    { regex: /\b([A-Za-z_]\w*_t)\b/g, cls: 'ty' },
    { regex: /\b([A-Z][A-Z0-9_]*)\b/g, cls: 'ty' },
    { regex: /\b([a-z_][\w]*)\s*(?=\()/g, cls: 'fn' },
    { regex: /[+\-*/%=<>!&|^~?:]+/g, cls: 'op' },
  ];
}

function phpRules() {
  const kw = [
    'abstract', 'and', 'array', 'as', 'break', 'callable', 'case', 'catch',
    'class', 'clone', 'const', 'continue', 'declare', 'default', 'do', 'echo',
    'else', 'elseif', 'empty', 'enddeclare', 'endfor', 'endforeach', 'endif',
    'endswitch', 'endwhile', 'enum', 'extends', 'final', 'finally', 'fn',
    'for', 'foreach', 'function', 'global', 'goto', 'if', 'implements',
    'include', 'include_once', 'instanceof', 'insteadof', 'interface', 'isset',
    'list', 'match', 'namespace', 'new', 'or', 'print', 'private', 'protected',
    'public', 'readonly', 'require', 'require_once', 'return', 'static',
    'switch', 'throw', 'trait', 'try', 'unset', 'use', 'var', 'while', 'xor',
    'yield', 'true', 'false', 'null', 'self', 'parent', 'this',
  ];
  const types = [
    'string', 'int', 'integer', 'float', 'double', 'bool', 'boolean',
    'object', 'mixed', 'void', 'never', 'iterable', 'resource', 'true', 'false', 'null',
  ];
  return [
    // PHP open/close tags must come first.
    { regex: /<\?(?:php|=)?|\?>/g, cls: 'tg' },
    // Comments — //, #, /* */, and PHPDoc /** */
    { regex: /\/\/[^\n]*/g, cls: 'cm' },
    { regex: /#[^\[\n][^\n]*/g, cls: 'cm' },
    { regex: /\/\*[\s\S]*?\*\//g, cls: 'cm' },
    // Heredoc / Nowdoc
    { regex: /<<<\s*(['"]?)([A-Za-z_]\w*)\1\n[\s\S]*?\n\s*\2;?/g, cls: 'st' },
    // Strings
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    // Variables — $foo, $this, ${...}
    { regex: /\$\{[^}]+\}/g, cls: 'vr' },
    { regex: /\$[A-Za-z_]\w*/g, cls: 'vr' },
    // Attributes #[Attr]
    { regex: /#\[[^\]]*\]/g, cls: 'fn' },
    // Keywords (case-insensitive)
    { regex: new RegExp(`\\b(${kw.join('|')})\\b`, 'gi'), cls: 'kw' },
    // Built-in / scalar types
    { regex: new RegExp(`\\b(${types.join('|')})\\b`, 'g'), cls: 'ty' },
    // Numbers: hex, binary, octal, decimal, floats
    { regex: /\b0[xX][0-9A-Fa-f_]+\b/g, cls: 'nu' },
    { regex: /\b0[bB][01_]+\b/g, cls: 'nu' },
    { regex: /\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?\b/g, cls: 'nu' },
    // ClassName / ::CONSTANT
    { regex: /\b([A-Z][A-Za-z0-9_]*)\b/g, cls: 'ty' },
    // Function / method calls
    { regex: /\b([a-z_][\w]*)\s*(?=\()/gi, cls: 'fn' },
    // Operators
    { regex: /=>|->|::|\?\?=?|\.\.\.|[+\-*/%=<>!&|^~?:.]+/g, cls: 'op' },
  ];
}

function iniRules() {
  return [
    { regex: /[#;][^\n]*/g, cls: 'cm' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    { regex: /^\s*\[[^\]\n]+\]/gm, cls: 'tg' },
    { regex: /^\s*[\w.-]+(?=\s*=)/gm, cls: 'vr' },
    { regex: /\b(true|false|yes|no|on|off)\b/gi, cls: 'kw' },
    { regex: /\b\d+(?:\.\d+)?\b/g, cls: 'nu' },
  ];
}

// Laravel Blade: HTML-flavoured templates with `@directive`, `{{ … }}` and
// `{!! … !!}` interpolation, `{{-- … --}}` comments, and `<x-…>` components.
function bladeRules() {
  return [
    // Blade comments first — they may contain quotes that would otherwise be
    // eaten by the string rules.
    { regex: /\{\{--[\s\S]*?--\}\}/g, cls: 'cm' },
    { regex: /<!--[\s\S]*?-->/g, cls: 'cm' },
    // Interpolation — emit as one variable-coloured span. Greedy enough to
    // span method calls (`{{ $this->form }}`) but stops at the closing pair.
    { regex: /\{!!\s*[\s\S]*?\s*!!\}/g, cls: 'vr' },
    { regex: /\{\{\s*[\s\S]*?\s*\}\}/g, cls: 'vr' },
    // Blade directives: @if, @foreach, @yield('content'), @extends('layouts.app')
    { regex: /@[A-Za-z_]\w*/g, cls: 'kw' },
    // Strings (HTML attribute values, PHP expressions inside directives)
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    // Tags — including Blade components like <x-filament::button>
    { regex: /<\/?[A-Za-z][\w.:\-]*/g, cls: 'tg' },
    // Attribute names: standard HTML, plus `wire:click`, `x-data`, `:prop`, `@click`
    { regex: /[@:]?[A-Za-z][\w.:\-]*(?==)/g, cls: 'vr' },
    // Tag close
    { regex: /\/?>/g, cls: 'tg' },
    // Numbers
    { regex: /\b\d+(?:\.\d+)?\b/g, cls: 'nu' },
  ];
}

// Symfony Twig: HTML-flavoured templates with `{{ … }}` output,
// `{% … %}` statements, `{# … #}` comments, filters `|filter`, and tags
// like `block`, `extends`, `for`, `if`. Also supports `<twig:component>` syntax.
function twigRules() {
  const stmtKw = [
    'extends', 'block', 'endblock', 'include', 'embed', 'endembed',
    'use', 'import', 'from', 'macro', 'endmacro',
    'if', 'elseif', 'else', 'endif',
    'for', 'endfor', 'in',
    'set', 'endset', 'with', 'only',
    'apply', 'endapply', 'autoescape', 'endautoescape', 'verbatim', 'endverbatim',
    'spaceless', 'endspaceless', 'do', 'flush',
    'true', 'false', 'null', 'not', 'and', 'or', 'is', 'as',
    'trans', 'endtrans',
  ];
  const fns = [
    'path', 'url', 'asset', 'asset_mapper', 'is_granted', 'csrf_token',
    'form', 'form_start', 'form_end', 'form_row', 'form_widget', 'form_label',
    'form_errors', 'form_help', 'form_rest', 'render', 'render_esi',
    'controller', 'parent', 'block', 'attribute', 'constant', 'cycle',
    'date', 'dump', 'include', 'max', 'min', 'random', 'range', 'source', 'template_from_string',
  ];
  return [
    // Twig comments — must come before output/statements (which use {%, {{)
    { regex: /\{#[\s\S]*?#\}/g, cls: 'cm' },
    { regex: /<!--[\s\S]*?-->/g, cls: 'cm' },
    // Statements {% ... %} — colour as keyword group
    { regex: /\{%-?\s*[\s\S]*?\s*-?%\}/g, cls: 'kw' },
    // Output {{ ... }} — colour as variable
    { regex: /\{\{-?\s*[\s\S]*?\s*-?\}\}/g, cls: 'vr' },
    // Strings (attribute values, inline literals outside Twig delimiters)
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    // <twig:component>, <a>, </div>, etc.
    { regex: /<\/?[A-Za-z][\w.:\-]*/g, cls: 'tg' },
    // Attribute names
    { regex: /[:@]?[A-Za-z][\w.:\-]*(?==)/g, cls: 'vr' },
    // Tag close
    { regex: /\/?>/g, cls: 'tg' },
    // Numbers
    { regex: /\b\d+(?:\.\d+)?\b/g, cls: 'nu' },
    // Bare keywords that survived (rare — most are eaten inside {% … %})
    { regex: new RegExp(`\\b(${stmtKw.join('|')})\\b`, 'g'), cls: 'kw' },
    { regex: new RegExp(`\\b(${fns.join('|')})\\b(?=\\s*\\()`, 'g'), cls: 'fn' },
  ];
}

// ~/.ssh/config — comments, `Keyword value` lines (Host, HostName, User, …),
// and `Host` blocks. No nested structure, no strings beyond what users quote
// occasionally.
function sshConfigRules() {
  return [
    { regex: /#[^\n]*/g, cls: 'cm' },
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    // Directive keyword at the start of a (possibly indented) line.
    { regex: /^\s*[A-Za-z][\w-]*(?=\s)/gm, cls: 'kw' },
    // Booleans / common literal values
    { regex: /\b(yes|no)\b/gi, cls: 'kw' },
    { regex: /\b\d+\b/g, cls: 'nu' },
  ];
}

// Helm chart templates — YAML structure with Go template actions `{{ … }}`.
// The Go-template rules are listed first so `{{- if .Values.x }}` doesn't get
// shredded by the YAML key matcher.
function helmRules() {
  const gotmplKw = [
    'if', 'else', 'end', 'range', 'with', 'define', 'template', 'block',
    'include', 'required', 'printf', 'print', 'println', 'quote', 'squote',
    'upper', 'lower', 'title', 'trim', 'trimAll', 'trimPrefix', 'trimSuffix',
    'replace', 'repeat', 'indent', 'nindent', 'toYaml', 'toJson', 'fromYaml',
    'fromJson', 'default', 'empty', 'coalesce', 'ternary', 'lookup', 'tpl',
    'and', 'or', 'not', 'eq', 'ne', 'lt', 'le', 'gt', 'ge', 'len', 'list',
    'dict', 'get', 'set', 'hasKey', 'pluck', 'merge', 'mergeOverwrite',
    'b64enc', 'b64dec', 'sha256sum', 'genCA', 'genSelfSignedCert',
    'genSignedCert', 'derivePassword', 'randAlphaNum', 'randAlpha',
    'randNumeric', 'randAscii', 'now', 'date', 'dateInZone',
  ];
  return [
    // Go-template comments {{/* ... */}}
    { regex: /\{\{-?\s*\/\*[\s\S]*?\*\/\s*-?\}\}/g, cls: 'cm' },
    // YAML line comments
    { regex: /#[^\n]*/g, cls: 'cm' },
    // Template delimiters — open and close — coloured as tags so the action
    // body inside stands out clearly from the surrounding YAML.
    { regex: /\{\{-?/g, cls: 'tg' },
    { regex: /-?\}\}/g, cls: 'tg' },
    // Strings inside actions
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    // Pipeline operator
    { regex: /\|/g, cls: 'op' },
    // Template variables — $foo, $.Values.x
    { regex: /\$[A-Za-z_][\w]*/g, cls: 'vr' },
    // Dotted paths: .Values.image.repository, .Release.Name, .Chart.Version,
    // .Files, .Capabilities, .Template — anything that starts with a dot.
    { regex: /\.[A-Za-z_][\w.]*/g, cls: 'vr' },
    // Template keywords / Sprig built-ins (must be \b-anchored)
    { regex: new RegExp(`\\b(${gotmplKw.join('|')})\\b`, 'g'), cls: 'kw' },
    // Booleans / nil
    { regex: /\b(true|false|nil|null)\b/g, cls: 'kw' },
    // Numbers
    { regex: /\b\d+(?:\.\d+)?\b/g, cls: 'nu' },
    // YAML keys (after the action rules so {{ foo }}: doesn't trip it)
    { regex: /^\s*[\w.-]+(?=\s*:)/gm, cls: 'tg' },
    // Operators inside actions
    { regex: /:=|=|<|>|!/g, cls: 'op' },
  ];
}

function hclRules() {
  const blockKw = [
    'terraform', 'provider', 'resource', 'data', 'module', 'variable',
    'output', 'locals', 'backend', 'required_providers', 'required_version',
    'lifecycle', 'dynamic', 'provisioner', 'connection', 'moved', 'check', 'import',
  ];
  const argKw = [
    'source', 'version', 'count', 'for_each', 'depends_on', 'providers',
    'type', 'default', 'description', 'sensitive', 'nullable', 'validation',
    'condition', 'error_message', 'prevent_destroy', 'create_before_destroy',
    'ignore_changes', 'replace_triggered_by',
  ];
  const types = [
    'string', 'number', 'bool', 'any', 'list', 'set', 'map', 'object', 'tuple',
  ];
  const literals = ['true', 'false', 'null'];
  return [
    // Comments — # and // and /* */
    { regex: /#[^\n]*/g, cls: 'cm' },
    { regex: /\/\/[^\n]*/g, cls: 'cm' },
    { regex: /\/\*[\s\S]*?\*\//g, cls: 'cm' },
    // Heredoc strings <<EOT ... EOT (and <<-EOT)
    { regex: /<<-?([A-Z_]+)\n[\s\S]*?\n\s*\1/g, cls: 'st' },
    // Double-quoted strings
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    // Interpolation markers (kept distinct so they pop visually)
    { regex: /\$\{[^}]*\}/g, cls: 'vr' },
    // Namespaced references (BEFORE keywords so `data.x.y` doesn't get split):
    // var.x / local.x / module.x / data.x.y / each.key / count.index
    { regex: /\b(var|local|module|data|each|count|self|path)\.[\w.]+/g, cls: 'vr' },
    // Top-level block keywords (also when followed by quoted label)
    { regex: new RegExp(`\\b(${blockKw.join('|')})\\b`, 'g'), cls: 'kw' },
    // Common meta-arguments
    { regex: new RegExp(`\\b(${argKw.join('|')})\\b(?=\\s*=|\\s*\\{)`, 'g'), cls: 'kw' },
    // Variable types in variable blocks: type = string / list(string) / map(...)
    { regex: new RegExp(`\\b(${types.join('|')})\\b`, 'g'), cls: 'ty' },
    { regex: new RegExp(`\\b(${literals.join('|')})\\b`, 'g'), cls: 'kw' },
    // Numbers
    { regex: /\b\d[\d_.]*\b/g, cls: 'nu' },
    // Resource/data type identifiers like "aws_s3_bucket" or "google_storage_bucket"
    { regex: /\b[a-z][a-z0-9]+(_[a-z0-9]+)+\b/g, cls: 'ty' },
    // Function calls: merge(...), format(...), jsonencode(...)
    { regex: /\b([a-z_][\w]*)\s*(?=\()/g, cls: 'fn' },
    // Operators
    { regex: /=>|\?\?|==|!=|&&|\|\||[+\-*/%=<>!&|^~?:]+/g, cls: 'op' },
  ];
}

// nginx.conf — block directives (server / location / http / events / upstream / if / map),
// $variables ($host, $remote_addr, $uri…), regular directives at line start
// (proxy_pass, fastcgi_pass, listen, return, …), on/off booleans, and units (1m, 30s, 1y).
function nginxRules() {
  const blockKw = [
    'http', 'server', 'location', 'events', 'upstream', 'if', 'map', 'geo',
    'types', 'mail', 'stream', 'split_clients', 'limit_except',
    'charset_map', 'match',
  ];
  return [
    // Comments
    { regex: /#[^\n]*/g, cls: 'cm' },
    // Strings — double and single quoted
    { regex: /"(?:\\.|[^"\\])*"/g, cls: 'st' },
    { regex: /'(?:\\.|[^'\\])*'/g, cls: 'st' },
    // Nginx variables: $host, $remote_addr, ${cookie_session}, $http_user_agent
    { regex: /\$\{[^}\n]+\}/g, cls: 'vr' },
    { regex: /\$[A-Za-z_][\w]*/g, cls: 'vr' },
    // Block-opening keywords at start of (possibly indented) line — when the
    // line ends in `{` (e.g. `    location ~ \.php$ {`). Includes the leading
    // whitespace in the match so it beats the generic "first word of a line"
    // directive rule below.
    { regex: new RegExp(`^\\s*\\b(${blockKw.join('|')})\\b(?=[^;\\n]*\\{)`, 'gm'), cls: 'kw' },
    // Booleans / common literal values
    { regex: /\b(on|off|true|false|none|default|auto|any|all)\b/g, cls: 'kw' },
    // Directive at the start of a (possibly indented) line — covers the long
    // tail of names (proxy_pass, fastcgi_pass, listen, return, root, alias,
    // include, gzip, ssl_certificate, add_header, limit_req, …).
    { regex: /^\s*[a-zA-Z_][\w]*(?=\s)/gm, cls: 'fn' },
    // HTTP status codes + sizes/durations: 200, 5s, 1m, 10M, 2g, 1y
    { regex: /\b\d+(?:\.\d+)?[a-zA-Z%]*\b/g, cls: 'nu' },
    // Semicolons + braces stand out as operators
    { regex: /[;{}]/g, cls: 'op' },
  ];
}
