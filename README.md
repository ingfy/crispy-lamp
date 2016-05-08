# ts-talk

Unit-tested Typescript-written Chrome Extension

For fun =) 

StackOverflow provides useful code snippets. But sometimes you want to run them!

## Algorithm

Assumes the browser is on a StackOverflow page.

1. Find all `<pre><code>...</code></pre>` tags
2. Somehow find out what language they are in
3. Append them with a button "Run in codepad!"
4. Add button click listener GOTO-5:
5. Open new browser window
6. Send POST request to http://codepad.org/ with form data:
   lang: <language> (ex.: Python)
   code: <content>
   run: True
   submit: Submit

Available languages:
C
C++
D
Haskell
Lua
OCaml
PHP
Perl
Python
Ruby
Scheme
Tcl

## Oppbygning

Denne seksjonen beskriver hvordan prosjektet blir strukturert. Dette er 
grunnmuren til presentasjonen.

## Litt om Chrome-utvidelser

* Typer utvidelser: hvilke filer de støtter i konfigen, hvordan de kjøres 
  (background page, content script, etc.)

:)

### Hvordan kompilere Typescript-koden til å bli en Chrome-extension

Det kjappe svaret er: Browserify med tsify!

For å pakke det ned til en Chrome-extension må vi bundle filene våre sammen til 
enkeltfiler som kan kjøres i browseren, av Chrome. TIl dette bruker vi 
browserify som pakker sammen require-avhengigheter til en enkelt "bundle". Siden
vi ikke bruker require, men bruker Typescript med sitt import-system (som for
øvrig er veldig likt ES6 sitt), bruker vi tsify-pluginen til å kjøre alt gjennom
en Typescript-kompilator som spytter ut kode med CommonJS require-avhengigheter.

TODO: bruke typescript-kompilatoren til bundling i stedet? Hvis vi må bruke
browserify, hvorfor?

### Testing

gulp-mocha + typescript-require

## Filewriter? FIlesystem? webrtc/MediaStream??!?!

Disse er typings som chrome-typings er avhengige av.