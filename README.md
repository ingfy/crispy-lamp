# ts-talk

Dette prosjektet er en nettleserutvidelse til Google Chrome skrevet i Typescript, med enhetstester. Nettleserutvidelsen legger til "kjør kode"-funksjonalitet på StackOverflow-kodesnutter, som åpner et nytt nettleservindu med Codepad.org og koden limt inn. Poenget med prosjektet er en presentasjon for Ciber Developer Update i mai 2016 (CDU).

Hovedfokuset med prosjektet og presentasjonen er den underliggende teknologien, altså Typescript,gulp og enhetstesting med karma og PhantomJS, og ikke det faktum at produktet er en Chrome-utvidelse.

## Codepad.org

[Codepad](http://codepad.org/) er en side der man kan kjøre små kodesnutter i forskjellige språk, og lage "pastes", dvs. lenker til kode man kan dele med andre. Vår utvidelse kan bruke denne siden til å støtte kjøring av kodesnutter på nettsider.

Heldigvis kan Codepad-hjemmesiden motta en anonym POST-spørring som inneholder skjemadata og gi tilbake en side. Vi er heldige her, siden de ikke krever noen cookie eller noe lignende for at POST-spørringen skal fungere.

Det finnes mange slike sider på nettet, men Codepad er veldig enkelt å integere mot. Antallet støttede språk er dessverre ikke så høyt. 

Liste over tilgjengelige språk på Codepad:

* C
* C++
* D
* Haskell
* Lua
* OCaml
* PHP
* Perl
* Python
* Ruby
* Scheme
* Tcl

## StackOverflow

[StackOverflow](http://stackoverflow.com/) er en en utviklers beste venn. Det er en Q&A-side der man kan stille spørsmål, få svar, og ikke minst lese andre brukere sine spørsmål. Både spørsmål og svar på denne siden har ofte tilhørende kodesnutter. Av og til er disse kodesnuttene egnet til å kjøres som en selvstendig enhet, og der er her Codepad-integrasjonen denne nettleserutvidelsen kommer inn i bildet.

## Algoritme

> Antar at nettleseren er på en StackOverflow-side.
>
> 1. Finn alle `<pre><code>...</code></pre>`-elementer
> 2. Finn ut hvilket språk de er på
> 3. Legg til en knapp "Run in codepad!"
> 4. Trykk på knappen gjør:
> 5. Åpne et nytt nettleservindu
> 6. Send en POST-spørring til http://codepad.org/ med skjemadata:
>
>    ```
>    lang: <language> (ex.: Python)
>    code: <content>
>    run: True
>    submit: Submit
>    ``` 


## Google Chrome-utvidelser

Chrome-utvidelser kan brukes til å legge inn funksjonalitet i selve nettleseren, og til å forbedre spesfikke nettsider. Dette gjøres ved hjelp av bakgrunns-/eventsider og innholdsscript. Eventsider kjøres i bakgrunnen og kan integrere med nettleseren, mens innholdsscript hører til en spesifikk nettside som matcher en gitt URL og har tilgang til DOM-en på den nettsiden. Siden dette prosjekter fokuserer på teknologi, vil denne utvidelsen kun inneholde et innholdsscript.

En utvidelse til Chrome består av et manifest, et sett med JavaScript- og HTML-filer, og tilleggsressurser som ikoner og bilder. Alle utvidelser til Google Chrome må inneholde et manifest "`manifest.json`", som beskriver funksjonaliteten til utvidelsen og hvilke tilganger den trenger.

## Oppbygning

Denne seksjonen beskriver hvordan prosjektet blir strukturert. Dette er 
grunnmuren til presentasjonen.

Følgende rammeverk og verktøy er brukt:

1. Typescript
2. Gulp
3. Karma
4. Mocha
5. PhantomJS
6. SystemJS

### Teknologien i bruk

Gulp kjører alle oppgavene våre.

| Oppgave   | Beskrivelse |
| --------- | ----------- |
| compile   | Kompilér Typescript-kode (kildekode og testkode) til Javascript og legg output i `build/app`.  | 
| manifest  | Kopier manifestet til `build/` og legg til en liste over alle JS-filene i                      |
|           | `web_accessible_resources` slik at de kan lastes av SystemJS.                                  |
| resources | Kopiler bilder (ikonet) til `build/resources`.                                                 |
| loader    | Konkatenér system.js og loader.js og legg resultatet som `build/contentScript.js`. Dette er    |
|           | inngangspunktet til appen.                                                                     |
| build     | `compile, manifest, resources`                                                                 |
| test      | Kjør opp en karmaserver med PhantomJS. Bruk SystemJS til å laste inn test- og kildekodefiler   |
|           | til Phantom og bruk Mocha til å teste dem.                                                     |

## Manus og fremgangsmåte

Presentasjonen består av å bygge denne utvidelsen live.

### 1. Hvordan skal vi bygge opp dette her?

Vi må tenke litt på hva vi skal lage først. Siden vi skal lage en chrome-utvidelse må vi finne ut hva slags script vi skal kjøre. Målet med utvidelsen vår er å legge til en knapp som åpner en ny tab som sender en POST-spørring til Codepad. POST-spørringen kan vi heldigvis implementere med å legge inn HTML `<form>`-elementer på StackOverflow-siden, med action som poster til Codepad. Dermed behøver ikke utvidelsen vår å snakke med Chrome-API-et. Det er en stor fordel, siden vi kan gjøre en del forenklinger når vi vet at utvidelsen vår bare trenger å bestå av et innholdsscript.

### 2. De første filene: den første kildefila og alt det andre

Vi starter oppsettet av applikasjonen med det vanlige: sette opp et git-repo og en npm-pakke. Vi må også lage et Chrome Extension-manifest og en typescript-fil. Vi legger også inn et ikon for utvidelsen vår. Når de grunnleggende filene er satt opp, lager vi de første kildefilene som en proof of concept. Det er så på tide å teste utvidelsen i Google Chrome! Den gjør ikke stort ennå, men det er viktig å validere at oppsettet vårt fungerer før vi går videre.

1. Opprett et git-repository: `git init`
2. Husk .gitignore!

   ```gitignore
   # .gitignore
   
   dist/
   build/
   node_modules/
   tmp/
   typings/
   ``` 

3. Opprett en npm-pakke: `npm init`
4. Lag et Chrome Extension-manifest i `manifest.json`:

    ```json
    {
      "name": "<navn>",
      "description": "<beskrivelse>",
      "version": "0.0.1",
      "manifest_version": 2,
      "permissions": [],
      "icons": {
        "128": "resources/icon128.png"
      },
      "content_scripts": [{
          "matches": ["*://*.stackoverflow.com/*"],
          "js": ["contentScript.js"]
      }]
    }
    ```
    
5. Lag en `typescript.json` for å deklarere kompileringen av Typescript i prosjektet. Vi targeter ES5 siden det kjører i Chrome.
    
    ```json
    {
      "compilerOptions": {
        "target": "es5",
        "outDir": "build",
        "sourceMap": false,
        "noImplicitAny": false
      },
      "exclude": [
        "node_modules",
        "build"
      ]
    }
    ```
  
6. src/contentScript.ts

    ```javascript
    // src/contentScript.ts
    
    var hello = document.createElement('p');
    hello.textContent = 'Hello CDU!';
    document.body.appendChild(hello);
    ```
    
7. src/contentScript.spec.ts (????? -- ;)...)

    ```javascript
    // src/contentScript.spec.ts
    
    // TODO: test applikasjonen! (husk å late som at du skrev testene først)
    ```
    
8. Ikonet vårt! https://githyb.com/ingfy/crispy-lamp/resources/icon128.png
9. Bygg ts-fila manuelt via VS Code og lag pakke manuelt.
10. Last inn i Chrome som developer extension og gå til StackOverflow og sjekk at det kommer en ny tag der

### 3. Gulp: Starte på gulpfila

Vi vil bruke gulp til å bygge prosjektet siden det er veldig fleksibelt og lett å bruke. Vi kan også skrive gulpfiler i Typescript! Det gir oss enda en mulighet for å bruke TS. Vi setter opp en ganske grunnleggende gulpfil for å bygge prosjektet, og så bruker vi den til å automatisere opprettingen av pakken.

1. Legg til `gulpfile.ts` i "exclude" i typescript.json:

    ```json
    {
      ...
      "exclude": ["gulpfile.ts", ...],
      ...
    }
    ```
2. Installere gulp og de pluginene vi trenger:

    ```bash
    $ npm install -g gulp typescript
    $ npm install --save-dev typescript gulp del gulp-sourcemaps gulp-typescript
    ``` 
    
3. Lag en gulpfile.js som kjører en gulpfile.ts med typescript.transpile();
    
    ```javascript
    // gulpfile.js
    
    let typescript = require('typescript');
    let fs = require('fs');
    let gulpfile = fs.readFileSync('./gulpfile.ts').toString();
    eval(typescript.transpile(gulpfile));
    ```
    
4. Must-have gulpoppgaver:
  + compile
  + build
  + resources
  + manifest
  + clean
  + watch
  
   ```typescript
   // gulpfile.ts
   
   import gulp = require('gulp');
   import del = require('del');
   import sourcemaps = require('gulp-sourcemaps');
   import typescript = require('gulp-typescript');
   import fs = require('fs');
   
   gulp.task('compile', () => {
       let project = typescript.createProject('tsconfig.json');
       
       return project.src()
           .pipe(sourcemaps.init())
           .pipe(typescript(project))
           .pipe(sourcemaps.write({sourceRoot: './src'}))
           .pipe(gulp.dest('build'));
   });

   gulp.task('manifest', () => {
       return gulp.src('manifest.json')
           .pipe(gulp.dest('build'));
   });

   gulp.task('resources', () => {
       return gulp.src('resources/**/*')
           .pipe(gulp.dest('build/resources'));
   });
   gulp.task('build', ['compile', 'manifest', 'resources']);

   gulp.task('clean', cb => del.sync(['build']));

   gulp.task('watch', () => gulp.watch("src/**/*", ['build']));

   gulp.task('default', ['build']);
   ```
  
5. Hvorfor må vi bruke en merkelig måte på å transpilere gulpfila?
6. Starte med typings. Typings er et program som lar oss laste ned og holde styr på typedeklarasjoner som Typescript kan bruke.

    * Installere typings globalt: `npm install -g typings`
    * Typings vi trenger til hele prosjektet: https://github.com/ingfy/crispy-lamp/blob/master/typings.json    
    
7. Få "POC-utvidelsen" til å kjøre med gulp

### 4. Hva med flere kildekodefiler i applikasjonen?

Vi vil så absolutt bruke Typescript sitt modulsystem. Vi trenger et modulsystem som nettleseren støtter, siden Chrome-utvidelser kjører i nettleseren. SystemJS gir svaret: "universell modullaster for JavaScript". Vanligvis brukes SystemJS med at bibiolteket lastes først i en browser, også kjøres en konfigurasjon, før den første fila lastes og kjøres ved hjelp av `System.import()`. Vi kan konkattenere disse tre stegene til en JavaScript-fil ved hjelp av en gulptask. Vi ender dermed opp med en ny fil som entry-point til content-scriptet vårt.
 
1. Installer SystemJS: `npm install --save system.js`
2. Ny fil som kan konfe SystemJS til å bruke en pakke som vi kaller "app" og laste applikasjonen:

    ```javascript
    // system.loader.js
    
    System.config({
      baseURL: chrome.extension.getURL('/'), // Hent den merkelige hash-URL-en til utvidelsen. Sjekk Chrome dev tools!
      packages: {
        'app': {
            defaultExtension: 'js'
        }
      }
    })
    
    System.import('app/hello').then(process => process.main());
    ```

3. Modifiser compile-oppgaven slik at den spytter ut filer til `build/app`:

    ```typescript
    // gulpfile.ts
    
    gulp.task('compile, () => {
        ...
        .pipe(gulp.dest('build/app'));
    });
    ```

4. Nytt entry point: Omdøp `src/contentScript.ts` til `src/hello.ts` (og tilsvarende med .spec.ts-fila)
5. Installer gulp-concat: `npm install --save-dev gulp-concat`
6. Ny gulp-task: "loader", og endre på "build"-oppgaven til å kjøre den:

    ```typescript
    // gulpfile.ts
    
    import concat = require('gulp-concat');
    
    gulp.task('loader', ['compile'], () => {
      return gulp.src(['node_modules/systemjs/dist/system.src.js', 'system.loader.js'])
        .pipe(concat('contentScript.js'))
        .pipe(gulp.dest('build'));
    });
    
    gulp.task('build', ['compile', 'manifest', 'resources', 'loader']);
    ```
    
7. Utvid manifestet `manifest.json` til å deklarere alle javascript-filene i "app"-pakken som tilgjengelige via XHR:

    ```json
    {
      ...
      "web_accessible_resources": ["app/*.js"],
      '''
    }
    ```
    

### 4. Sette opp enhetstester

Hvordan skal vi kjøre testene? Rene unittester? I kontekst av en browser? Headless? Vi bruker testrammeverket Mocha og assertion-bibioteket chai fordi det er enkelt. Vi kjører Mocha gjennom Karma, som setter opp en "hodeløs" nettleser som heter PhantomJS. Dermed kan vi teste kode i kontekst av en nettleser--slik som utvidelsen (som er et innholdsscript) vil kjøre.  

0. Skriv en test for `hello.ts`:

    ```typescript
    // src/hello.spec.ts
    
    import {expect} from 'chai';

    import * as hello from './hello';

    describe('hello', () => {
      describe('main()', () => {
        it('should greet the people', () => {
          hello.main();
          expect(document.querySelector('p').textContent).to.match(/hello/gi);
        });
      });
    });
    ```

1. Installer Mocha, Chai, Karma, PhantomJS og avhengigheter:

    ```bash
    npm install --save-dev karma karma-mocha chai karma-mocha-reporter karma-phantomjs-launcher karma-systemjs
    ```
    
2. Konfigurer karma til å bruke Mocha og PhantomJS, og å hente opp kompilerte filer:

    ```javascript
    // karma.conf.js
    
    'use strict';

    module.exports = config => {
      config.set({
        basePath: './',        
        frameworks: ['mocha'],
        plugins: [
          'karma-mocha', 
          'karma-phantomjs-launcher',
          'karma-mocha-reporter'
        ],
        files: [
          {pattern: 'build/*.js', incldued: false, watched: true},
          {pattern: 'build/**/*.js', incldued: false, watched: true},
          {pattern: 'build/*.spec.js', included: true, watched: true},
          {pattern: 'build/**/*.spec.js', included: true, watched: true}
        ],
        exclude: [
          'build/contentScript.js'
        ],
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_WARN,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true
      });
    };
    ```

3. Konfigurer Karma til å bruke SystemJS, og PhantomJS, og la filer hente opp chai gjennom systemjs konfig, ved å merge inn følgende konfigurasjon for SystemJS:

    ```javascript
    // karma.conf.js
    
    ...      
      frameworks: ['systemjs', ...],
      plugins: ['karma-systemjs', ...],
      systemjs: {
        config: {
          transpiler: null,
          paths: {
            'systemjs': 'node_modules/systemjs/dist/system.js',
            'chai': 'node_modules/chai/chai.js'
          },
          packages: {
            'build/app': {
                defaultExtension: 'js'
            }
          }
        },
        serveFiles: [
          'node_modules/**/*.js',
          'build/**/*.js'
        ]
      },
    ...
    
    ```

4. Kjør karma direkte og test: `.\node_modules\.bin\karma start`
5. Lag gulp-tasker for å starte karma og watche:

    ```typescript
    // gulpfile.ts
        
    import {Server as KarmaServer} from 'karma';
    
    function runKarma(singleRun: boolean, cb?: () => void) {    
      new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: singleRun
      }, cb).start();
    }
    
    gulp.task('test', ['build'], cb => runKarma(true, cb));
    gulp.task('test-watch', cb => runKarma(false, cb));    
    gulp.task('watch', () => {
      gulp.watch("src/**/*", ['build']);
      runKarma(false);
    });
    ```
6. Kjør testene fra gulp med `gulp test`!

### 5. Programmere utvidelsen med watch kjørende

* Bruk `gulp watch` under utvikling for å validere at testene kjører
* ~~Lim~~ Skriv inn kodesnutt etter kodesnutt
* Test utvidelsen på et spørsmål: http://stackoverflow.com/a/2612815

### 6. Pakking av utvidelsen

* gulp-zip og "zip"-oppgave
* Custom typing for gulp-zip 