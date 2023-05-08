// util/getlang.ts

export const getLanguageFromFilename = (filename: string) => {
  const fileExtension = filename.split('.').pop()?.toLowerCase();
  switch (fileExtension) {
    case 'js':
      return 'javascript';
    case 'jsx':
      return 'jsx';
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'tsx';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'cpp':
      return 'cpp';
    case 'html':
      return 'markup';
    case 'css':
      return 'css';
    case 'c':
      return 'c';
    case 'go':
      return 'go';
    case 'rb':
      return 'ruby';
    case 'php':
      return 'php';
    case 'swift':
      return 'swift';
    case 'sh':
      return 'bash';
    case 'rs':
      return 'rust';
    case 'kt':
      return 'kotlin';
    case 'r':
      return 'r';
    case 'scala':
      return 'scala';
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    case 'md':
      return 'markdown';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'lua':
      return 'lua';
    case 'sql':
      return 'sql';
    case 'pl':
      return 'perl';
    case 'dart':
      return 'dart';
    case 'groovy':
      return 'groovy';
    case 'ps1':
      return 'powershell';
    case 'vb':
      return 'visual-basic';
    case 'm':
      return 'objective-c';
    case 'f':
    case 'f90':
    case 'f95':
      return 'fortran';
    case 'cob':
    case 'cbl':
      return 'cobol';
    case 'haskell':
      return 'haskell';
    case 'hs':
      return 'haskell';
    case 'elm':
      return 'elm';
    case 'purs':
      return 'purescript';
    case 'cls':
      return 'apex';
    case 'sol':
      return 'solidity';
    case 'scm':
    case 'scheme':
      return 'scheme';
    case 'coffee':
    case 'coffee-script':
      return 'coffeescript';
    case 'less':
      return 'less';
    case 'scss':
      return 'scss';
    case 'styl':
    case 'stylus':
      return 'stylus';
    case 'tsv':
      return 'tsv';
    case 'ini':
      return 'ini';
    case 'shex':
      return 'shexc';
    case 'elm':
      return 'elm';
    case 'kt':
      return 'kotlin';
    case 'scss':
      return 'scss';
    case 'less':
      return 'less';
    case 'lua':
      return 'lua';
    case 'pug':
      return 'pug';
    case 'svg':
      return 'svg';
    case 'tex':
      return 'tex';
    case 'vbnet':
      return 'vbnet';
    case 'erl':
      return 'erlang';
    case 'jl':
      return 'julia';
    case 'ml':
      return 'ocaml';
    case 'pas':
      return 'pascal';
    case 'pl':
      return 'prolog';
    case 'pde':
      return 'processing';
    case 'rkt':
      return 'racket';
    case 'tcl':
      return 'tcl';
    case 'vhdl':
      return 'vhdl';
    case 'lisp':
        return 'lisp';
    // Add more cases for other file extensions
    default:
      return 'plaintext';
  }
};