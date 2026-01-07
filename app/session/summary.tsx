import { View, ScrollView } from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSessionStore } from '../../core/store';
import { calculateStats } from '../../core/scoring';

export default function SessionSummary() {
    const { currentSessionPutts } = useSessionStore();
    const stats = calculateStats(currentSessionPutts);

    const percentage = Math.round(stats.makeRate * 100);

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 20, textAlign: 'center' }}>Session Complete!</Text>

            <Card style={{ marginBottom: 20 }}>
                <Card.Title title="Results" />
                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text variant="displaySmall" style={{ color: stats.makeRate >= 0.8 ? '#4CAF50' : '#FF9800' }}>
                                {percentage || 0}%
                            </Text>
                            <Text>Make Rate</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text variant="displaySmall">{stats.totalPutts}</Text>
                            <Text>Total Putts</Text>
                        </View>
                    </View>
                    <Divider style={{ marginVertical: 10 }} />
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', marginTop: 10 }}>Analysis</Text>
                    <Text variant="bodyMedium">CoC (90% Zone): {stats.coC} ft</Text>
                    <Text variant="bodyMedium">Total Makes: {currentSessionPutts.filter(p => p.result === 'make').length}</Text>
                </Card.Content>
            </Card>

            <Button mode="contained" onPress={() => router.replace('/(tabs)')} style={{ marginTop: 20 }}>
                Back to Dashboard
            </Button>
        </SafeAreaView>
    );
}
