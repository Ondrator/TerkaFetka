# Hlavonožec – stav projektu

Hotový jednostránkový statický web sestavený z pěti Google Stitch exportů. Menu a CTA posouvají na sekce. Společné komponenty jsou v src/components, obsah v src/pages a upravitelné styly a interakce v assets. index.html je sestavená verze. Součástí je volitelný nástroj pro opětovné sestavení a lokální náhled, pro samotný provoz na běžném hostingu nejsou potřeba.

## Provedené úpravy
- Sjednocená typografie, barevnost, tlačítka, mezery, navigace, hlavička a patička.
- Dodaný maskot a favicon odvozený od originálu; originály log zůstaly zachovány.
- Optimalizované místní fonty a ikony, bez externího CDN či analytiky.
- Mobilní menu, označení aktuální sekce, přístupné akordeony, formulář s validací a přímým odesláním přes Formspree.
- Sloučení opakovaných profilů zakladatelek do týmové sekce; odstranění zjevných pracovních poznámek a vzorových kvalifikací.
- Zpětné přesměrování původních názvů stránek na sekce jednoho webu.

## Co musí dodat provozovatel
- Portréty a finální medailonky vedoucích; fotografie základny. Odkaz na původní vzdálený obrázek vracel chybu 403, proto je použit dodaný maskot.
- Konkrétní odkaz na neveřejné fotoalbum. Tlačítko nyní připraví žádost e-mailem.
- Cena, potvrzený termín, podmínky účasti/storna, doprava, balicí seznam, přihláška a informace o zpracování údajů účastníků. Rok 2027 a termín 12.–18. 7. byly převzaty z obsahu exportu, nikoli z názvu složky 2025.
- Přesné odkazy na sociální sítě; v návrhu byly pouze obecné domovské adresy služeb, proto jsou názvy sítí uvedeny jako text.
- Kontaktní formulář je napojen na uživatelem dodaný endpoint https://formspree.io/f/mvkkzjkn. Zobrazuje stav odesílání, potvrzení po úspěšné odpovědi služby a chyby při odmítnutí či síťovém problému. Nastavení příjemce a případná omezení spravuje provozovatel ve Formspree. Registrace místa ani platby nejsou implementovány a web je nepředstírá.

## Ověření
Skutečný prohlížeč Microsoft Edge: šířky 320, 390, 768, 1024 a 1440 px. Bez horizontálního přetékání, rozbitých obrázků, chyb JavaScriptu, chybějících souborů či externích požadavků při prohlížení. Ověřeny posuny a aktuální sekce, menu na mobilu i Escape, FAQ a soukromí.

Formspree napojení bylo ověřeno s kontrolovanými odpověďmi služby v prohlížeči: povinná pole, neplatný e-mail, stav odesílání, úspěšná odpověď a vymazání formuláře, odmítnutí 422, limit služby 429 a síťová chyba. Při chybě zůstávají údaje zachované. Testy neposílaly skutečnou zprávu; doručení do cílové schránky a nastavení účtu Formspree nejsou tímto ověřené.

První nasazení GitHub Pages bylo nutné spustit ručně přes API; poté web přešel do built a veřejná adresa vrátila HTTP 200.
