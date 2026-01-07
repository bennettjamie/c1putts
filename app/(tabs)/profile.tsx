import { View, ScrollView } from 'react-native';
import { Text, Avatar, List, Divider, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Profile() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <Avatar.Text size={80} label="JD" />
                    <Text variant="headlineSmall" style={{ marginTop: 10, fontWeight: 'bold' }}>John Doe</Text>
                    <Text variant="bodyMedium" style={{ color: 'gray' }}>PDGA #12345</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>18 ft</Text>
                        <Text variant="bodySmall">Confidence</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>1,240</Text>
                        <Text variant="bodySmall">Putts</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>12</Text>
                        <Text variant="bodySmall">Badges</Text>
                    </View>
                </View>

                <Divider style={{ marginBottom: 20 }} />

                <List.Section>
                    <List.Subheader>Settings</List.Subheader>
                    <List.Item
                        title="Putting Style"
                        description="Manage styles (Spin, Push, etc.)"
                        left={props => <List.Icon {...props} icon="arm-flex" />}
                    />
                    <List.Item
                        title="Bag / Putters"
                        left={props => <List.Icon {...props} icon="bag-personal" />}
                    />
                    <List.Item
                        title="App Settings"
                        left={props => <List.Icon {...props} icon="cog" />}
                    />
                </List.Section>

                <Button
                    mode="contained"
                    buttonColor="red"
                    style={{ marginTop: 20 }}
                    onPress={() => router.replace('/')} // Logout
                >
                    Log Out
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}
