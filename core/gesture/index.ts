/**
 * Gesture Recognition Service
 * 
 * This module handles hand gesture detection for make/miss input.
 * 
 * Phase 1 (Current): Simulated detection using button presses + timing
 * Phase 2 (Future): Full MediaPipe Hands integration via native modules
 * 
 * MediaPipe integration requires:
 * - react-native-vision-camera for frame processing
 * - Expo Development Build (can't use Expo Go)
 * - Native Kotlin/Swift modules for MediaPipe SDK
 * 
 * For now, we use a "gesture training" simulation that teaches users
 * the gestures via animation, then uses manual button presses with
 * visual feedback that mimics gesture confirmation.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Vibration } from 'react-native';

export type GestureType = 'thumbs_up' | 'thumbs_down' | 'open_palm' | 'peace' | 'none';

export interface GestureState {
    current: GestureType;
    confidence: number;
    holdProgress: number; // 0-1, how long gesture has been held
    isConfirmed: boolean;
}

interface UseGestureDetectionOptions {
    holdDuration?: number; // ms required to confirm gesture
    onGestureConfirmed?: (gesture: GestureType) => void;
}

/**
 * Hook for gesture detection
 * 
 * Currently uses simulated detection via button presses.
 * Will be upgraded to MediaPipe when native modules are integrated.
 */
export function useGestureDetection(options: UseGestureDetectionOptions = {}) {
    const { holdDuration = 1000, onGestureConfirmed } = options;

    const [gestureState, setGestureState] = useState<GestureState>({
        current: 'none',
        confidence: 0,
        holdProgress: 0,
        isConfirmed: false,
    });

    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    const clearTimers = useCallback(() => {
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
        }
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    }, []);

    // Simulate gesture start (called by button press in training mode)
    const simulateGestureStart = useCallback((gesture: GestureType) => {
        clearTimers();
        startTimeRef.current = Date.now();

        setGestureState({
            current: gesture,
            confidence: 0.8,
            holdProgress: 0,
            isConfirmed: false,
        });

        // Initial haptic feedback
        Vibration.vibrate(50);

        // Progress update interval (for UI animation)
        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const progress = Math.min(elapsed / holdDuration, 1);

            setGestureState(prev => ({
                ...prev,
                holdProgress: progress,
                confidence: 0.8 + (progress * 0.2), // Confidence grows with hold time
            }));
        }, 50);

        // Confirmation timer
        holdTimerRef.current = setTimeout(() => {
            clearTimers();

            // Confirm gesture
            setGestureState(prev => ({
                ...prev,
                holdProgress: 1,
                confidence: 1,
                isConfirmed: true,
            }));

            // Strong haptic feedback on confirm
            Vibration.vibrate([0, 100, 50, 100]);

            // Callback
            onGestureConfirmed?.(gesture);

            // Reset after short delay
            setTimeout(() => {
                setGestureState({
                    current: 'none',
                    confidence: 0,
                    holdProgress: 0,
                    isConfirmed: false,
                });
            }, 1500);
        }, holdDuration);
    }, [holdDuration, onGestureConfirmed, clearTimers]);

    // Cancel current gesture (finger lifted before hold complete)
    const cancelGesture = useCallback(() => {
        clearTimers();
        setGestureState({
            current: 'none',
            confidence: 0,
            holdProgress: 0,
            isConfirmed: false,
        });
    }, [clearTimers]);

    // Cleanup on unmount
    useEffect(() => {
        return clearTimers;
    }, [clearTimers]);

    return {
        gestureState,
        simulateGestureStart,
        cancelGesture,
        isDetecting: gestureState.current !== 'none' && !gestureState.isConfirmed,
        isConfirmed: gestureState.isConfirmed,
    };
}

/**
 * Maps gesture types to user actions
 */
export function gestureToAction(gesture: GestureType): 'make' | 'miss' | 'undo' | 'end' | null {
    switch (gesture) {
        case 'thumbs_up':
            return 'make';
        case 'thumbs_down':
            return 'miss';
        case 'open_palm':
            return 'undo';
        case 'peace':
            return 'end';
        default:
            return null;
    }
}
