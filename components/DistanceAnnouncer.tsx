import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useEffect } from 'react';
import { speechService } from '../../services/speech';

interface DistanceAnnouncerProps {
    distance: number;
    visible: boolean;
    onComplete?: () => void;
}

export function DistanceAnnouncer({
    distance,
    visible,
    onComplete,
}: DistanceAnnouncerProps) {
    useEffect(() => {
        if (visible) {
            speechService.playMoveToDistance(distance);

            // Auto-dismiss after announcement
            const timer = setTimeout(() => {
                onComplete?.();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [visible, distance, onComplete]);

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>🎯</Text>
                <Text style={styles.text}>Moving to</Text>
                <Text style={styles.distance}>{distance} feet</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    content: {
        alignItems: 'center',
    },
    emoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        color: '#aaa',
        marginBottom: 10,
    },
    distance: {
        fontSize: 60,
        fontWeight: 'bold',
        color: '#00ff88',
    },
});
