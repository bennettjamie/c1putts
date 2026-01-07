import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, List, Divider, Button, Switch, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onboardingManager } from '../../core/onboarding';

interface PlayerProfile {
    name: string;
    heightFeet: number;
    heightInches: number;
    heightCm: number;
    useMetric: boolean;
    dominantHand: 'right' | 'left' | 'ambidextrous';
    putterCount: number;
}

const DEFAULT_PROFILE: PlayerProfile = {
    name: 'Player',
    heightFeet: 5,
    heightInches: 10,
    heightCm: 178,
    useMetric: false,
    dominantHand: 'right',
    putterCount: 5,
};

export default function Profile() {
    const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
    const [editingHeight, setEditingHeight] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const stored = await AsyncStorage.getItem('c1putts_profile');
            if (stored) {
                setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(stored) });
            }
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    };

    const saveProfile = async (updates: Partial<PlayerProfile>) => {
        const newProfile = { ...profile, ...updates };
        setProfile(newProfile);
        await AsyncStorage.setItem('c1putts_profile', JSON.stringify(newProfile));
    };

    const getHeightDisplay = () => {
        if (profile.useMetric) {
            return `${profile.heightCm} cm`;
        }
        return `${profile.heightFeet}'${profile.heightInches}"`;
    };

    const handleResetOnboarding = async () => {
        await onboardingManager.resetOnboarding();
        router.replace('/');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Avatar.Text size={80} label={profile.name.substring(0, 2).toUpperCase()} />
                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.subtitle}>Beta Trainer</Text>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>18 ft</Text>
                        <Text style={styles.statLabel}>CoC</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>1,240</Text>
                        <Text style={styles.statLabel}>Putts</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Badges</Text>
                    </View>
                </View>

                <Divider style={styles.divider} />

                {/* Player Settings */}
                <Text style={styles.sectionTitle}>Player Settings</Text>

                {/* Height */}
                <View style={styles.settingCard}>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Height</Text>
                        <Text style={styles.settingValue}>{getHeightDisplay()}</Text>
                    </View>

                    {/* Unit Toggle */}
                    <View style={styles.unitToggle}>
                        <Text style={styles.toggleLabel}>
                            {profile.useMetric ? 'Metric' : 'Imperial'}
                        </Text>
                        <Switch
                            value={profile.useMetric}
                            onValueChange={(v) => saveProfile({ useMetric: v })}
                            color="#00ff88"
                        />
                    </View>

                    {/* Height Picker */}
                    {!profile.useMetric ? (
                        <View style={styles.heightPicker}>
                            <View style={styles.pickerCol}>
                                <Text style={styles.pickerLabel}>Feet</Text>
                                <View style={styles.pickerButtons}>
                                    {[4, 5, 6, 7].map(ft => (
                                        <Pressable
                                            key={ft}
                                            onPress={() => saveProfile({ heightFeet: ft })}
                                            style={[
                                                styles.pickerBtn,
                                                profile.heightFeet === ft && styles.pickerBtnActive
                                            ]}
                                        >
                                            <Text style={[
                                                styles.pickerBtnText,
                                                profile.heightFeet === ft && styles.pickerBtnTextActive
                                            ]}>{ft}'</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.pickerCol}>
                                <Text style={styles.pickerLabel}>Inches</Text>
                                <View style={styles.pickerButtons}>
                                    {[0, 2, 4, 6, 8, 10, 11].map(inch => (
                                        <Pressable
                                            key={inch}
                                            onPress={() => saveProfile({ heightInches: inch })}
                                            style={[
                                                styles.pickerBtn,
                                                styles.pickerBtnSmall,
                                                profile.heightInches === inch && styles.pickerBtnActive
                                            ]}
                                        >
                                            <Text style={[
                                                styles.pickerBtnText,
                                                profile.heightInches === inch && styles.pickerBtnTextActive
                                            ]}>{inch}"</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.heightPicker}>
                            <View style={styles.pickerCol}>
                                <Text style={styles.pickerLabel}>Centimeters</Text>
                                <View style={styles.pickerButtons}>
                                    {[150, 160, 170, 175, 180, 185, 190, 200].map(cm => (
                                        <Pressable
                                            key={cm}
                                            onPress={() => saveProfile({ heightCm: cm })}
                                            style={[
                                                styles.pickerBtn,
                                                styles.pickerBtnSmall,
                                                profile.heightCm === cm && styles.pickerBtnActive
                                            ]}
                                        >
                                            <Text style={[
                                                styles.pickerBtnText,
                                                profile.heightCm === cm && styles.pickerBtnTextActive
                                            ]}>{cm}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Dominant Hand */}
                <View style={styles.settingCard}>
                    <Text style={styles.settingLabel}>Dominant Putting Hand</Text>
                    <View style={styles.handOptions}>
                        {[
                            { id: 'right', label: '🫱 Right', desc: 'Right Dominant' },
                            { id: 'left', label: '🫲 Left', desc: 'Left Dominant' },
                            { id: 'ambidextrous', label: '🙌 Both', desc: 'Ambidextrous' },
                        ].map(option => (
                            <Pressable
                                key={option.id}
                                onPress={() => saveProfile({ dominantHand: option.id as 'right' | 'left' | 'ambidextrous' })}
                                style={[
                                    styles.handOption,
                                    profile.dominantHand === option.id && styles.handOptionActive
                                ]}
                            >
                                <Text style={styles.handEmoji}>{option.label.split(' ')[0]}</Text>
                                <Text style={[
                                    styles.handLabel,
                                    profile.dominantHand === option.id && styles.handLabelActive
                                ]}>{option.desc}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Putter Count */}
                <View style={styles.settingCard}>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Putters per Round</Text>
                        <Text style={styles.settingValue}>{profile.putterCount}</Text>
                    </View>
                    <View style={styles.putterButtons}>
                        {[3, 4, 5, 6, 7, 8, 10].map(count => (
                            <Pressable
                                key={count}
                                onPress={() => saveProfile({ putterCount: count })}
                                style={[
                                    styles.putterBtn,
                                    profile.putterCount === count && styles.putterBtnActive
                                ]}
                            >
                                <Text style={[
                                    styles.putterBtnText,
                                    profile.putterCount === count && styles.putterBtnTextActive
                                ]}>{count}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <Divider style={styles.divider} />

                {/* App Settings */}
                <Text style={styles.sectionTitle}>App Settings</Text>

                <List.Item
                    title="Reset Onboarding"
                    description="Go through setup again"
                    left={props => <List.Icon {...props} icon="refresh" />}
                    onPress={handleResetOnboarding}
                    style={styles.listItem}
                    titleStyle={styles.listTitle}
                    descriptionStyle={styles.listDesc}
                />

                <Button
                    mode="outlined"
                    style={styles.logoutBtn}
                    textColor="#ff6b6b"
                    onPress={() => router.replace('/')}
                >
                    Log Out
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f1a',
    },
    content: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#00ff88',
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    divider: {
        backgroundColor: '#333',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 16,
    },
    settingCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: 'white',
        marginBottom: 8,
    },
    settingValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00ff88',
    },
    unitToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    toggleLabel: {
        color: '#888',
        fontSize: 14,
    },
    heightPicker: {
        gap: 12,
    },
    pickerCol: {
        marginBottom: 8,
    },
    pickerLabel: {
        color: '#666',
        fontSize: 12,
        marginBottom: 8,
    },
    pickerButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pickerBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#0f0f1a',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    pickerBtnSmall: {
        paddingHorizontal: 12,
    },
    pickerBtnActive: {
        backgroundColor: '#00ff8820',
        borderColor: '#00ff88',
    },
    pickerBtnText: {
        color: '#888',
        fontSize: 14,
    },
    pickerBtnTextActive: {
        color: '#00ff88',
        fontWeight: 'bold',
    },
    handOptions: {
        flexDirection: 'row',
        gap: 10,
    },
    handOption: {
        flex: 1,
        backgroundColor: '#0f0f1a',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    handOptionActive: {
        borderColor: '#00ff88',
        backgroundColor: '#00ff8810',
    },
    handEmoji: {
        fontSize: 28,
        marginBottom: 4,
    },
    handLabel: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
    },
    handLabelActive: {
        color: '#00ff88',
    },
    putterButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    putterBtn: {
        width: 44,
        height: 44,
        backgroundColor: '#0f0f1a',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#333',
    },
    putterBtnActive: {
        borderColor: '#00ff88',
        backgroundColor: '#00ff8820',
    },
    putterBtnText: {
        color: '#888',
        fontSize: 16,
    },
    putterBtnTextActive: {
        color: '#00ff88',
        fontWeight: 'bold',
    },
    listItem: {
        backgroundColor: '#1a1a2e',
        borderRadius: 12,
        marginBottom: 8,
    },
    listTitle: {
        color: 'white',
    },
    listDesc: {
        color: '#888',
    },
    logoutBtn: {
        marginTop: 20,
        borderColor: '#ff6b6b',
    },
});
