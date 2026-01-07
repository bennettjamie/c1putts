
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Text, Button, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { useVision } from '../../core/vision-pipeline';

export default function ActiveSession() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [putts, setPutts] = useState<Array<'make' | 'miss'>>([]);
    const [isManual, setIsManual] = useState(false);
    const { isReady: isVisionReady } = useVision();

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button mode="contained" onPress={requestPermission}>grant permission</Button>
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const handleEndSession = () => {
        router.replace('/session/summary');
    };

    const handleAddPutt = (result: 'make' | 'miss') => {
        addPutt({
            distance: 18, // TODO: Get from vision
            result,
            timestamp: Date.now()
        });
    };

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing}>
                <View style={styles.overlay}>
                    {/* Top Bar */}
                    <View style={styles.topBar}>
                        <View>
                            <Text style={styles.text}>Distance: ~18ft</Text>
                            <Text style={{ color: '#ccc', fontSize: 12 }}>
                                {isManual ? 'Manual Mode' : (isVisionReady ? 'Vision: Active' : 'Vision: Loading...')}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <IconButton icon={isManual ? "eye-off" : "eye"} iconColor="white" onPress={() => setIsManual(!isManual)} />
                            <IconButton icon="camera-flip" iconColor="white" onPress={toggleCameraFacing} />
                        </View>
                    </View>

                    {/* Center Region */}
                    <View style={styles.centerRegion}>
                        {isManual ? (
                            <View style={styles.manualControls}>
                                <TouchableOpacity style={[styles.manualBtn, { backgroundColor: '#F44336' }]} onPress={() => handleAddPutt('miss')}>
                                    <Text style={styles.manualBtnText}>MISS</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.manualBtn, { backgroundColor: '#4CAF50' }]} onPress={() => handleAddPutt('make')}>
                                    <Text style={styles.manualBtnText}>MAKE</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.reticle}>
                                <Text style={{ color: 'rgba(0,255,0,0.8)', textAlign: 'center', marginTop: 10 }}>Align Basket Here</Text>
                            </View>
                        )}
                    </View>

                    {/* Bottom Controls */}
                    <View style={styles.bottomControls}>
                        <View>
                            <Text style={styles.statText}>Putts: {currentSessionPutts.length}/20</Text>
                            <Text style={{ color: 'white' }}>
                                Makes: {currentSessionPutts.filter(p => p.result === 'make').length} ({currentSessionPutts.length > 0 ? Math.round((currentSessionPutts.filter(p => p.result === 'make').length / currentSessionPutts.length) * 100) : 0}%)
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Button mode="outlined" textColor="white" onPress={undoPutt} disabled={currentSessionPutts.length === 0}>Undo</Button>
                            <Button mode="contained" buttonColor="red" onPress={handleEndSession}>End</Button>
                        </View>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 50,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    centerRegion: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reticle: {
        width: 200,
        height: 300,
        borderWidth: 2,
        borderColor: 'rgba(0,255,0,0.5)',
        borderStyle: 'dashed',
    },
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
        borderRadius: 10,
    },
    statText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    manualControls: {
        flexDirection: 'row',
        gap: 20,
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    manualBtn: {
        paddingVertical: 30,
        paddingHorizontal: 40,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'white',
        elevation: 5,
    },
    manualBtnText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
