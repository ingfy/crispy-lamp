# ts-talk

Unit-tested Typescript-written Chrome Extension

For fun =) 

StackOverflow provides useful code snippets. But sometimes you want to run them!

## Codepad.org

[Codepad](http://codepad.org/) er en side der man kan kjøre små kodesnutter i forskjellige språk, og lage "pastes", dvs. lenker til koden man kan dele med andre. Vår utvidelse kan bruke denne siden til å støtte kjøring av kodesnutter på nettsider.

Heldigvis kan Codepad-hjemmesiden motta en anonym POST-spørring som inneholder skjemadata og gi tilbake en side. Vi er heldige her, siden de ikke krever noen cookie eller noe lignende for at POST-spørringen skal fungere.

Det finnes mange slike sider på nettet, men Codepad er veldig enkelt å integere mot. Antallet støttede språk er dessverre ikke så høyt. 

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
>    ```
>    lang: <language> (ex.: Python)
>    code: <content>
>    run: True
>    submit: Submit
>    ``` 

### Tilgjgengelige språk

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