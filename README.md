# Lantern Lane — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/xb1jaa/spot-the-difference-game-01/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/xb1jaa/spot-the-difference-game-01/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard)

Two pictures. Seven differences. Three scenes. Find them all before the lanterns burn down.

**Lantern Lane** is a spot-the-difference game played in the browser. Two
near-identical hand-drawn scenes sit side by side — a dusk street, a harbor
at dawn, a starlit garden — and seven things differ between them. Click a
difference on either picture to circle it; a wrong click costs five seconds.

## How to play

- **Click / tap** a difference on either picture. Found differences are circled in green on both pictures.
- **Timer:** 90 seconds per scene. Finish a scene to bank a time bonus (+5 per second left).
- **Score:** +100 per difference, with a +25 streak bonus for consecutive finds. A hint costs 25 points.
- **Keys:** `H` hint (2 per scene), `P` pause, `M` mute, `R` restart, `Enter` to start.
- Three scenes, seven differences each — find all 21 for the final score and up to three stars.

## Running it

No build step, no network: every file is under `game/`.

```sh
node serve.ts        # serves game/ on http://localhost:8080
```

Open http://localhost:8080 in a desktop browser and play. All art is drawn
procedurally on canvas and all sounds are synthesized with WebAudio — there
are no image, font or audio files to download.

## Entry

`main.ts` copies `game/` and `screenshots/` to `/output` and writes
`/output/dossier.json` with the make.fun game library. Screenshots are real
renders of the game taken in a desktop browser (`shots.json` lists the
staged states: title, mid-game, final score).

## License

MIT — see `LICENSE`.
