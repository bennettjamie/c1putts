/**
 * Onboarding State Management
 * 
 * Tracks whether user has completed onboarding and their preferences.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    ONBOARDING_COMPLETE: '@c1putts_onboarding_complete',
    PUTTER_COUNT: '@c1putts_putter_count',
    LAST_LOCATION_ID: '@c1putts_last_location_id',
    INPUT_MODE: '@c1putts_input_mode',
    IS_FIRST_TIME: '@c1putts_first_time',
};

export type InputMode = 'gesture' | 'voice' | 'manual';

export interface OnboardingState {
    isComplete: boolean;
    isFirstTime: boolean;
    putterCount: number;
    lastLocationId: string | null;
    inputMode: InputMode;
}

class OnboardingManager {
    private state: OnboardingState = {
        isComplete: false,
        isFirstTime: true,
        putterCount: 5, // Default to 5 for easy percentages
        lastLocationId: null,
        inputMode: 'gesture',
    };

    async initialize(): Promise<OnboardingState> {
        try {
            const [complete, putterCount, locationId, inputMode, firstTime] = await Promise.all([
                AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE),
                AsyncStorage.getItem(KEYS.PUTTER_COUNT),
                AsyncStorage.getItem(KEYS.LAST_LOCATION_ID),
                AsyncStorage.getItem(KEYS.INPUT_MODE),
                AsyncStorage.getItem(KEYS.IS_FIRST_TIME),
            ]);

            this.state = {
                isComplete: complete === 'true',
                isFirstTime: firstTime !== 'false',
                putterCount: putterCount ? parseInt(putterCount, 10) : 5,
                lastLocationId: locationId,
                inputMode: (inputMode as InputMode) || 'gesture',
            };
        } catch (error) {
            console.error('Failed to load onboarding state:', error);
        }
        return this.state;
    }

    async completeOnboarding(): Promise<void> {
        this.state.isComplete = true;
        this.state.isFirstTime = false;
        await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
        await AsyncStorage.setItem(KEYS.IS_FIRST_TIME, 'false');
    }

    async setPutterCount(count: number): Promise<void> {
        this.state.putterCount = count;
        await AsyncStorage.setItem(KEYS.PUTTER_COUNT, count.toString());
    }

    async setLocationId(id: string): Promise<void> {
        this.state.lastLocationId = id;
        await AsyncStorage.setItem(KEYS.LAST_LOCATION_ID, id);
    }

    async setInputMode(mode: InputMode): Promise<void> {
        this.state.inputMode = mode;
        await AsyncStorage.setItem(KEYS.INPUT_MODE, mode);
    }

    async resetOnboarding(): Promise<void> {
        this.state = {
            isComplete: false,
            isFirstTime: true,
            putterCount: 5,
            lastLocationId: null,
            inputMode: 'gesture',
        };
        await AsyncStorage.multiRemove(Object.values(KEYS));
    }

    getState(): OnboardingState {
        return { ...this.state };
    }

    isNewLocation(currentLocationId: string): boolean {
        return this.state.lastLocationId !== currentLocationId;
    }
}

export const onboardingManager = new OnboardingManager();
