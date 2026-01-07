/**
 * Audio Service for C100%
 * 
 * Provides sound feedback for gestures and session events.
 * Gracefully handles missing audio files with console warnings.
 */

import { Audio, AVPlaybackSource } from 'expo-av';

// Sound sources - wrapped in try-catch to handle missing files
const getSounds = (): Record<string, AVPlaybackSource | null> => {
    try {
        return {
            whoosh: require('../assets/audio/whoosh.mp3'),
            chains: require('../assets/audio/chains.mp3'),
            clank: require('../assets/audio/clank.mp3'),
            undo: require('../assets/audio/undo.mp3'),
            applause: require('../assets/audio/applause.mp3'),
        };
    } catch {
        console.warn('AudioService: Audio files not found. Using silent mode.');
        return {
            whoosh: null,
            chains: null,
            clank: null,
            undo: null,
            applause: null,
        };
    }
};

type SoundName = 'whoosh' | 'chains' | 'clank' | 'undo' | 'applause';

class AudioService {
    private sounds: Map<SoundName, Audio.Sound | null> = new Map();
    private isLoaded = false;
    private isSilentMode = false;

    async initialize() {
        if (this.isLoaded) return;

        try {
            // Configure audio mode
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });

            const sources = getSounds();

            // Check if we have actual audio files
            const hasFiles = Object.values(sources).some(s => s !== null);
            this.isSilentMode = !hasFiles;

            if (this.isSilentMode) {
                console.log('AudioService: Running in silent mode (no audio files)');
                this.isLoaded = true;
                return;
            }

            // Pre-load sounds
            for (const [name, source] of Object.entries(sources)) {
                if (source) {
                    try {
                        const { sound } = await Audio.Sound.createAsync(source);
                        this.sounds.set(name as SoundName, sound);
                    } catch (error) {
                        console.warn(`AudioService: Failed to load ${name}`, error);
                        this.sounds.set(name as SoundName, null);
                    }
                }
            }

            this.isLoaded = true;
            console.log('AudioService: Sounds loaded');
        } catch (error) {
            console.warn('AudioService: Initialization failed', error);
            this.isSilentMode = true;
            this.isLoaded = true;
        }
    }

    async play(soundName: SoundName) {
        if (this.isSilentMode) {
            console.log(`AudioService: Would play '${soundName}' (silent mode)`);
            return;
        }

        const sound = this.sounds.get(soundName);
        if (!sound) {
            console.warn(`AudioService: Sound not available: ${soundName}`);
            return;
        }

        try {
            await sound.replayAsync();
        } catch (error) {
            console.warn(`AudioService: Failed to play ${soundName}`, error);
        }
    }

    // Convenience methods
    async playGestureDetected() {
        await this.play('whoosh');
    }

    async playMake() {
        await this.play('chains');
    }

    async playMiss() {
        await this.play('clank');
    }

    async playUndo() {
        await this.play('undo');
    }

    async playRoundComplete() {
        await this.play('applause');
    }

    async cleanup() {
        for (const sound of this.sounds.values()) {
            if (sound) {
                await sound.unloadAsync();
            }
        }
        this.sounds.clear();
        this.isLoaded = false;
    }

    isSilent(): boolean {
        return this.isSilentMode;
    }
}

export const audioService = new AudioService();
