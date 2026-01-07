# Audio Assets

This directory contains sound effects for the C100% app.

## Required Files

| File | Sound | Recommended Source |
|------|-------|--------------------|
| `whoosh.mp3` | Disc flying / wind swoosh | [Freesound: swoosh](https://freesound.org/search/?q=swoosh) |
| `chains.mp3` | Disc golf basket chains | [Freesound: chains rattle](https://freesound.org/search/?q=chains+rattle) |
| `clank.mp3` | Metal cage/band hit | [Freesound: metal clang](https://freesound.org/search/?q=metal+clang) |
| `undo.mp3` | Reverse swoosh | Same as whoosh, reversed |
| `applause.mp3` | Soft hand clapping | [Freesound: applause small](https://freesound.org/search/?q=applause+small) |

## How to Add Audio Files

1. Visit [Freesound.org](https://freesound.org) (free account required)
2. Search for each sound using the links above
3. Filter by **License: CC0** (Public Domain)
4. Download MP3 format
5. Rename to match the filenames above
6. Place in this directory (`assets/audio/`)

## Licensing Requirements

All audio files **MUST** be:
- ✅ Royalty-free
- ✅ CC0 (Public Domain) or CC-BY license
- ✅ Attributed in app credits if required by license

## Placeholder Mode

Until audio files are added, the app will use silent fallbacks.
The `AudioService` checks for file existence before playing.

## Recommended Sounds (Specific Freesound IDs)

These are suggestions - verify license before using:

| Sound | Freesound ID | Direct Link |
|-------|--------------|-------------|
| Whoosh | 60013 | freesound.org/people/qubodup/sounds/60013/ |
| Chains | 514360 | freesound.org/people/Merrick079/sounds/514360/ |
| Clank | 321103 | freesound.org/people/peepholecircus/sounds/321103/ |
| Applause | 277215 | freesound.org/people/Garzotto/sounds/277215/ |
