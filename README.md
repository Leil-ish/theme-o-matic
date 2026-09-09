# Theme-O-Matic

A tiny generator for "what's today's discussion theme" — for two friends who
want a topic to riff on, ranging from wholesome to fully unhinged.

## How it works

- Pick an **unhinged level** (1–5) with the slider.
- Hit **Today's Official Theme** — it's computed deterministically from
  today's date + the chosen level (a simple hash, calculator-style), so both
  of you get the *same* theme on the *same* day at the *same* level, without
  any shared server or account.
- Hit **Reroll (Random)** if you want a different one right now, no date
  constraint.
- Past themes you've generated are kept locally in your browser (`localStorage`)
  under "Past Themes."

## Levels

1. Wholesome — comfort food, favorite movies, songs, nostalgia
2. Spicy — bad dates, guilty pleasures, unpopular opinions
3. Chaotic — drunk decisions, weird DMs, roommate horror stories
4. Feral — hookup stories, breakup chaos, 3am regrets
5. Unhinged — no notes, just go look

## Adding more themes

Edit [`themes.js`](themes.js) — each level is a plain array of strings, any
length. Nothing else needs to change.

## Running locally

It's static — just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8934
```

## Deploying

Push to GitHub and enable **GitHub Pages** (Settings → Pages → deploy from
`main` branch, root) to get a shareable link.
