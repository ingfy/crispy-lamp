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

* git init
* Husk .gitignore!
* npm init
* manifest.json

    ```json
    {
      "name": "ts-talk",
      "description": "StackOverflow code run buttons",
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
  
* src/contentScript.ts

    ```javascript
    var hello = document.createElement('p');
    hello.textContent = 'Hello CDU!';
    document.body.appendChild(hello);
    ```
    
* src/contentScript.spec.ts (????? -- ;)...)

    ```javascript
    // TODO: test applikasjonen! (husk å late som at du skrev testene først)
    ```
    
* Ikonet vårt! Viktig å velge riktig
* Bygg ts-fila manuelt via VS Code og lag pakke manuelt.

### 3. Gulp: Starte på gulpfila

* Gulpfile.ts med typescript.transpile();
* Must-have gulpoppgaver:
  + compile
  + build
  + resources
  + manifest
* Hvorfor må vi bruke en merkelig måte på å transpilere gulpfila?
* Starte med typings

### 4. Hva med flere kildekodefiler i applikasjonen?

Vi vil så absolutt bruke Typescript sitt modulsystem.
 
* Ta stilling til SystemJS
* Nytt entry point

### 4. Sette opp enhetstester

* Hvordan skal vi kjøre testene? Rene unittester? I kontekst av en browser? Headless?
* Testrammeverk: Mocha
* Assertions: Chai
* Karma: velkommen til confighelvete

### 5. Programmere utvidelsen med watch kjørende

* Bruk `gulp watch` under utvikling for å validere at testene kjører
* TODO: lim inn kodesnutt etter kodesnutt
* Legg til i maniest: `web_accessible_resources`

### 6. Pakking av utvidelsen

* gulp-zip og "zip"-oppgave
* Custom typing for gulp-zip 