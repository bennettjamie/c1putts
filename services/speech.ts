/**
 * Speech Service
 * 
 * Uses text-to-speech for audio feedback.
 * Temporary solution until real sound effects are added.
 * Supports background audio (doesn't pause user's music).
 */

import * as Speech from 'expo-speech';

class SpeechService {
    private isSpeaking = false;

    async speak(text: string, options?: { rate?: number; pitch?: number }): Promise<void> {
        if (this.isSpeaking) return;

        try {
            this.isSpeaking = true;
            await Speech.speak(text, {
                rate: options?.rate ?? 1.0,
                pitch: options?.pitch ?? 1.0,
                language: 'en-US',
                onDone: () => {
                    this.isSpeaking = false;
                },
                onError: () => {
                    this.isSpeaking = false;
                },
            });
        } catch (error) {
            console.error('Speech error:', error);
            this.isSpeaking = false;
        }
    }

    // Sound effect substitutes using speech
    async playMake(): Promise<void> {
        await this.speak('Make!', { pitch: 1.2 });
    }

    async playMiss(): Promise<void> {
        await this.speak('Miss', { pitch: 0.8 });
    }

    async playRoundComplete(makes: number, total: number): Promise<void> {
        await this.speak(`Round complete! ${makes} of ${total} makes.`);
    }

    async playMoveToDistance(distance: number): Promise<void> {
        await this.speak(`Moving to ${distance} feet!`);
    }

    async playWelcome(): Promise<void> {
        await this.speak('Welcome to C 1 Putts!');
    }

    async playGestureDetected(gesture: string): Promise<void> {
        await this.speak(gesture);
    }

    async playHighFive(): Promise<void> {
        await this.speak("Let's go!", { pitch: 1.3 });
    }

    async playSessionComplete(makes: number, total: number): Promise<void> {
        const percent = Math.round((makes / total) * 100);
        await this.speak(`Session complete! You made ${makes} of ${total} putts. That's ${percent} percent!`);
    }

    async playWhoosh(): Promise<void> {
        // Placeholder - would be actual whoosh sound
        // For now, silent or very quick sound
        console.log('🎵 Whoosh!');
    }

    async playChains(): Promise<void> {
        await this.speak('Chains!', { pitch: 1.3 });
    }

    async playClank(): Promise<void> {
        await this.speak('Clank', { pitch: 0.7 });
    }

    async announceDistance(distance: number): Promise<void> {
        await this.speak(`Move to ${distance} feet!`, { rate: 0.9 });
    }

    async playReady(): Promise<void> {
        await this.speak('Ready!', { pitch: 1.1 });
    }

    stop(): void {
        Speech.stop();
        this.isSpeaking = false;
    }
}

export const speechService = new SpeechService();
