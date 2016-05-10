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

karma + mocha + systemjs

## Filewriter? FIlesystem? webrtc/MediaStream??!?!

Disse er typings som chrome-typings er avhengige av.

## Manus og fremgangsmåte

Presentasjonen består av å bygge denne utvidelsen live.

### 1. Hvordan skal vi bygge opp dette her?

* Hva slags utvidelsesfunksjonalitet trenger vi? Innholdsscript eller eventside?

### 2. De første filene: den første kildefila og alt det andre

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
  
5. src/contentScript.ts

    ```javascript
    // src/contentScript.ts
    
    var hello = document.createElement('p');
    hello.textContent = 'Hello CDU!';
    document.body.appendChild(hello);
    ```
    
6. src/contentScript.spec.ts (????? -- ;)...)

    ```javascript
    // src/contentScript.spec.ts
    
    // TODO: test applikasjonen! (husk å late som at du skrev testene først)
    ```
    
7. Ikonet vårt! https://githyb.com/ingfy/crispy-lamp/resources/icon128.png
8. Bygg ts-fila manuelt via VS Code og lag pakke manuelt.
9. Last inn i Chrome som developer extension og gå til StackOverflow og sjekk at det kommer en ny tag der

### 3. Gulp: Starte på gulpfila

1. Lag en `typescript.json` for å deklarere kompileringen. Denne skal brukes i gulpfila.
    
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
        "build",
        "gulpfile.ts"
      ]
    }
    ```
2. Installere gulp og de pluginene vi trenger:

    ```bash
    $ npm install -g gulp typescript
    $ npm install --save-dev typescript gulp del gulp-sourcemaps gulp-typescript
    ``` 
    
3. Gulpfile.ts med typescript.transpile();
    
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

### 4. Sette opp enhetstester

* Hvordan skal vi kjøre testene? Rene unittester? I kontekst av en browser? Headless?
* Testrammeverk: Mocha
* Assertions: Chai
* Karma: velkommen til confighelvete

### 5. Programmere utvidelsen med watch kjørende

* Bruk `gulp watch` under utvikling for å validere at testene kjører
* TODO: lim inn kodesnutt etter kodesnutt
* Legg til i maniest: `web_accessible_resources`
* Test utvidelsen på et spørsmål: http://stackoverflow.com/a/2612815

### 6. Pakking av utvidelsen

* gulp-zip og "zip"-oppgave
* Custom typing for gulp-zip 