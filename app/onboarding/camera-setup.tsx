import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Button, RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

type CameraOption = 'selfie' | 'rear';

export default function CameraSetupScreen() {
    const router = useRouter();
    const [cameraChoice, setCameraChoice] = useState<CameraOption>('selfie');

    const handleContinue = () => {
        // Store camera choice and proceed to calibration
        router.push({
            pathname: '/onboarding/calibration',
            params: { camera: cameraChoice }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Camera Setup</Text>
                <Text style={styles.subtitle}>
                    Position your phone to see you AND the basket
                </Text>

                {/* Setup diagram */}
                <View style={styles.diagramContainer}>
                    <Image
                        source={require('../../assets/setup-diagram.png')}
                        style={styles.diagram}
                        resizeMode="contain"
                    />
                </View>

                {/* Tips */}
                <View style={styles.tipsContainer}>
                    <View style={styles.tipRow}>
                        <Text style={styles.tipIcon}>📱</Text>
                        <Text style={styles.tipText}>Lean phone against golf bag, tripod, or stake</Text>
                    </View>
                    <View style={styles.tipRow}>
                        <Text style={styles.tipIcon}>📐</Text>
                        <Text style={styles.tipText}>Form a triangle: Phone → You → Basket</Text>
                    </View>
                    <View style={styles.tipRow}>
                        <Text style={styles.tipIcon}>🎯</Text>
                        <Text style={styles.tipText}>You should be visible at all distances (5-30ft)</Text>
                    </View>
                </View>

                {/* Camera choice */}
                <View style={styles.cameraChoice}>
                    <Text style={styles.choiceTitle}>Which camera will you use?</Text>

                    <Pressable
                        onPress={() => setCameraChoice('selfie')}
                        style={[
                            styles.choiceCard,
                            cameraChoice === 'selfie' && styles.choiceCardSelected
                        ]}
                    >
                        <RadioButton
                            value="selfie"
                            status={cameraChoice === 'selfie' ? 'checked' : 'unchecked'}
                            onPress={() => setCameraChoice('selfie')}
                            color="#00ff88"
                        />
                        <View style={styles.choiceContent}>
                            <Text style={styles.choiceLabel}>📱 Selfie Camera</Text>
                            <Text style={styles.choiceDescription}>
                                See visual feedback on screen
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable
                        onPress={() => setCameraChoice('rear')}
                        style={[
                            styles.choiceCard,
                            cameraChoice === 'rear' && styles.choiceCardSelected
                        ]}
                    >
                        <RadioButton
                            value="rear"
                            status={cameraChoice === 'rear' ? 'checked' : 'unchecked'}
                            onPress={() => setCameraChoice('rear')}
                            color="#00ff88"
                        />
                        <View style={styles.choiceContent}>
                            <Text style={styles.choiceLabel}>📷 Rear Camera</Text>
                            <Text style={styles.choiceDescription}>
                                Better quality • Audio-only feedback via headphones
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleContinue}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                >
                    Continue to Calibration →
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f1a',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
    diagramContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        padding: 10,
        marginBottom: 20,
    },
    diagram: {
        width: '100%',
        height: 180,
    },
    tipsContainer: {
        gap: 10,
        marginBottom: 20,
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        padding: 12,
        borderRadius: 10,
    },
    tipIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#ccc',
    },
    cameraChoice: {
        gap: 10,
    },
    choiceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 6,
    },
    choiceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        padding: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceCardSelected: {
        borderColor: '#00ff88',
        backgroundColor: '#00ff8810',
    },
    choiceContent: {
        flex: 1,
        marginLeft: 8,
    },
    choiceLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    choiceDescription: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    footer: {
        padding: 24,
    },
    button: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
    },
    buttonLabel: {
        color: '#0f0f1a',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
