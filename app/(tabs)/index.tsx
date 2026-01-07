import { View, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Home() {
    const theme = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Dashboard</Text>
                    <Text variant="titleMedium" style={{ color: theme.colors.primary }}>C1: 82%</Text>
                </View>

                {/* Confidence Curve Placeholder */}
                <Card style={{ marginBottom: 20 }}>
                    <Card.Content>
                        <Title>Confidence Curve</Title>
                        <View style={{ height: 150, backgroundColor: theme.colors.surfaceDisabled, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Text>Graph Placeholder (Make % vs Distance)</Text>
                        </View>
                        <Paragraph style={{ marginTop: 10 }}>90% Confidence: 18 ft</Paragraph>
                    </Card.Content>
                </Card>

                {/* Quick Actions */}
                <Text variant="titleMedium" style={{ marginBottom: 10, fontWeight: 'bold' }}>Quick Start</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                    <Card onPress={() => router.push('/(tabs)/play')} style={{ flex: 1 }}>
                        <Card.Content style={{ alignItems: 'center' }}>
                            <MaterialCommunityIcons name="target" size={30} color={theme.colors.primary} />
                            <Title style={{ marginTop: 5, fontSize: 16 }}>Free Putt</Title>
                        </Card.Content>
                    </Card>
                    <Card onPress={() => router.push('/(tabs)/play')} style={{ flex: 1 }}>
                        <Card.Content style={{ alignItems: 'center' }}>
                            <MaterialCommunityIcons name="ladder" size={30} color={theme.colors.secondary} />
                            <Title style={{ marginTop: 5, fontSize: 16 }}>Ladder</Title>
                        </Card.Content>
                    </Card>
                </View>

                {/* Recent Sessions */}
                <Text variant="titleMedium" style={{ marginBottom: 10, fontWeight: 'bold' }}>Recent Activity</Text>
                {[1, 2, 3].map((i) => (
                    <Card key={i} style={{ marginBottom: 10 }}>
                        <Card.Title
                            title="Practice Session"
                            subtitle="Yesterday • 45 putts"
                            left={(props) => <MaterialCommunityIcons {...props} name="history" />}
                            right={(props) => <Text {...props} style={{ marginRight: 15, fontWeight: 'bold' }}>+2%</Text>}
                        />
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

// Helper for Icon in content
import { MaterialCommunityIcons } from '@expo/vector-icons';
