# Myśl Czuj Mów — Gabinet Terapeutyczny Kielce

Strona internetowa gabinetu terapeutycznego. Statyczna strona HTML — bez WordPressa, bez bazy danych.

---

## Jak wprowadzić zmianę w treści

### 1. Znajdź właściwy plik

| Co chcesz zmienić | Plik |
|---|---|
| Tekst na stronie głównej | `index.html` |
| Opis lub dane specjalisty | `pages/team.html` |
| Lista usług | `pages/services.html` |
| Cennik | `pages/pricing.html` |
| Numery telefonów, e-mail | `pages/contact.html` oraz `partials/footer.html` |
| Adres, godziny | `pages/location.html` oraz `partials/footer.html` |
| Menu nawigacyjne | `partials/header.html` |
| Stopka | `partials/footer.html` |

### 2. Otwórz plik i zmień tekst

Otwórz plik w dowolnym edytorze tekstu. Zmieniaj **tylko tekst między znacznikami** — nie ruszaj samych znaczników HTML.

```
DOBRZE:
<p>Psycholog z 10-letnim doświadczeniem.</p>
         ↑ to zmieniasz ↑

ŹLE:
<p class="bio"> ← tego nie ruszaj
```

### 3. Wgraj zmieniony plik na hosting

Po każdej zmianie plik trzeba wgrać na serwer — patrz sekcja **Hosting** poniżej.

---

## Hosting — Hostido

### Logowanie do panelu

1. Wejdź na **hostido.pl**
2. Kliknij **Logowanie** (górny prawy róg)
3. Wpisz dane logowania do konta

### Wgrywanie plików przez Menedżer plików

1. Po zalogowaniu przejdź do **cPanel** swojego hostingu
2. Znajdź sekcję **Pliki** → kliknij **Menedżer plików**
3. Wejdź do folderu **`public_html`** — to główny folder strony
4. Znajdź plik który chcesz zaktualizować (np. `pages/pricing.html`)
5. Kliknij plik prawym przyciskiem → **Prześlij** (lub przeciągnij plik z komputera)
6. Potwierdź nadpisanie pliku

### Wgrywanie plików przez FTP (alternatywnie)

Jeśli korzystasz z programu FTP (np. FileZilla):

1. Serwer: `ftp.myslczujmow.pl` (lub adres podany w Hostido)
2. Login i hasło: dane do FTP z panelu Hostido → **Konta FTP**
3. Port: `21`
4. Po połączeniu przejdź do folderu `public_html`
5. Przeciągnij zmienione pliki z komputera do folderu na serwerze

### Pierwsza migracja (wgranie całej strony)

Jeśli strona jest wgrywana po raz pierwszy lub od nowa:

1. Usuń całą zawartość folderu `public_html` (lub przenieś w inne miejsce jako backup)
2. Wgraj **wszystkie pliki i foldery** z tego repozytorium do `public_html`:
   - `index.html`
   - `pages/`
   - `partials/`
   - `css/`
   - `js/`
   - `images/`
   - `assets/`
3. Strona powinna działać pod domeną od razu

> **Uwaga:** WordPress i PHP nie są potrzebne. Jeśli na hostingu pozostały pliki z poprzedniej strony WP, można je usunąć — nie będą potrzebne.

---

## Formularz kontaktowy

Formularz na stronie kontaktowej jest obsługiwany przez **Formspree**. Wiadomości od pacjentów trafiają automatycznie na adres `biuro@myslczujmow.pl`. Nie wymaga żadnej konfiguracji po stronie hostingu.

---

## Czego nie zmieniać samodzielnie

Poniższe rzeczy wymagają pomocy dewelopera:

- Dodanie nowego specjalisty lub podstrony
- Zmiana kolorów, czcionek lub układu strony
- Dodanie Google Analytics lub innych narzędzi
- Zmiana struktury menu

---

## Kontakt do dewelopera

W razie pytań lub potrzeby wprowadzenia zmian technicznych — skontaktuj się z osobą, która zbudowała stronę.
