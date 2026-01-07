import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useRef } from 'react';
import { useGestureDetection, GestureType, gestureToAction } from '../core/gesture';

interface GestureButtonProps {
    gesture: GestureType;
    label: string;
    emoji: string;
    color: string;
    onConfirmed: (action: 'make' | 'miss' | 'undo' | 'end') => void;
    disabled?: boolean;
}

/**
 * Interactive gesture button with hold-to-confirm behavior
 * Uses React Native's built-in Animated API
 */
export function GestureButton({
    gesture,
    label,
    emoji,
    color,
    onConfirmed,
    disabled
}: GestureButtonProps) {
    const {
        gestureState,
        simulateGestureStart,
        cancelGesture,
        isDetecting,
        isConfirmed
    } = useGestureDetection({
        holdDuration: 1000,
        onGestureConfirmed: (g: GestureType) => {
            const action = gestureToAction(g);
            if (action) onConfirmed(action);
        }
    });

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const progress = gestureState.holdProgress;

    const handlePressIn = () => {
        if (disabled) return;
        Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
        }).start();
        simulateGestureStart(gesture);
    };

    const handlePressOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
        if (!isConfirmed) {
            cancelGesture();
        }
    };

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                style={[
                    styles.button,
                    { backgroundColor: color, opacity: disabled ? 0.5 : 1 }
                ]}
            >
                {/* Progress ring */}
                <View style={styles.progressContainer}>
                    <View
                        style={[
                            styles.progressRing,
                            {
                                borderColor: 'white',
                                borderWidth: isDetecting ? 4 : 0,
                                transform: [{ scale: 1 + progress * 0.1 }],
                                opacity: isDetecting ? 1 : 0,
                            }
                        ]}
                    />
                </View>

                {/* Content */}
                <Text style={styles.emoji}>{emoji}</Text>
                <Text style={styles.label}>{label}</Text>

                {/* Confirmed overlay */}
                {isConfirmed && (
                    <View style={styles.confirmedOverlay}>
                        <Text style={styles.confirmedText}>✓</Text>
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 8,
    },
    button: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        position: 'relative',
    },
    progressContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'absolute',
    },
    emoji: {
        fontSize: 36,
    },
    label: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 4,
    },
    confirmedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmedText: {
        fontSize: 48,
        color: '#4CAF50',
    },
});
