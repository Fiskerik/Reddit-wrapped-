# Reddit Wrapped Generator (2025)

Ett första utkast till en "Reddit Wrapped"-upplevelse med mörk, energisk och mobilvänlig design. Den här prototypen använder nu Reddit:s öppna JSON-endpoints (about, submitted och comments) för att hämta data för ett valt användarnamn, med fallback till mockdata om nätverket svarar med fel.

## Demoöversikt
- **Introduktion &amp; sammanfattning** visar total aktivitet, karma och antal aktiva dagar.
- **Konto &amp; identitet** lyfter karmafördelning, cake day och ev. premiumstatus.
- **Aktivitet &amp; persona** bryter ned fördelning mellan inlägg och kommentarer för året och visar persona-taggen.
- **Engagemang** redovisar genomsnittlig karma per post/kommentar, karma per dag, awards och mest använda emoji.
- **Topp 3 subreddits** renderas som adaptiva staplar med extra datapunkt för mest aktiva månad.
- **Posten som definierade dig** lyfter fram den mest framgångsrika posten/kommentaren, aktivitetsprofil (inlägg vs. kommentarer) och mest använda emoji.

## Struktur
```
public/
  data/mock_stats.json        # Mockad statistik för prototypen
src/
  components/IntroCard.js     # Introduktion och översikt
  components/SubredditChart.js# Stapeldiagram för toppsubreddits
  components/KarmaTrophy.js   # Trophy-kort med toppinlägg och persona
  styles/main.css             # Mörk, energisk styling
  App.js                      # Enkel bootstrap och rendering
server/
  api/get_stats.py            # Flask-endpoint som läser mockdatan
index.html                    # Enkel statisk entrypoint
```

## Hur man kör
1. Starta en enkel HTTP-server (krävs för att hämta JSON-filen i browsern):
   ```bash
   python3 -m http.server 8000
   ```
2. Öppna [http://localhost:8000](http://localhost:8000) i din browser och se prototypen.
3. Ange valfritt Reddit-användarnamn i formuläret (du kan skriva både `u/namn` eller bara `namn`). Verktyget hämtar live-data; vid fel visas mockad data.

## Backend-demo (Frivilligt)
En minimal Flask-endpoint finns i `server/api/get_stats.py` om du vill exponera mockdatan via API:
```bash
python3 server/api/get_stats.py
```
Endpoint: `GET http://localhost:5000/api/stats`

## Nästa steg
- Byt ut mockdatan mot Reddit API (OAuth 2.0) och cachning.
- Lägg till D3.js/Chart.js-animationer för ännu rikare grafer.
- Spara och jämför flera år för att skapa en tidslinjevy.

## Designnoter
- Mörk gradientbakgrund med glasig card-känsla.
- Mikroanimationer vid hover och staplar som fylls mjukt.
- Typografi: Inter/modern sans med hög kontrast för rubriker.
