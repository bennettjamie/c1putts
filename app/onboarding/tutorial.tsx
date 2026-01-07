import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const { width } = Dimensions.get('window');

const TUTORIAL_SLIDES = [
    {
        emoji: '📏',
        title: 'Practice Every Distance',
        description: 'From 5 feet to 30 feet, master your putting at every range.',
    },
    {
        emoji: '👍',
        title: 'Hands-Free Tracking',
        description: 'Thumbs up for MAKE\nThumbs down for MISS\n\nOr use voice: "Make!" / "Miss!"',
    },
    {
        emoji: '🎯',
        title: '5 Putters = Easy Math',
        description: 'We recommend 5 discs per round.\nEach make = 20%!',
    },
    {
        emoji: '🤖',
        title: 'Train the AI',
        description: 'Your practice data helps improve the app for everyone.\nYou\'re not just practicing—you\'re teaching!',
    },
];

export default function TutorialScreen() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    const isLastSlide = currentSlide === TUTORIAL_SLIDES.length - 1;
    const slide = TUTORIAL_SLIDES[currentSlide];

    const handleNext = () => {
        if (isLastSlide) {
            router.push('/onboarding/putter-count');
        } else {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        router.push('/onboarding/putter-count');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Skip button */}
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    iconColor="#aaa"
                    size={24}
                    onPress={handleBack}
                    disabled={currentSlide === 0}
                />
                <Button mode="text" textColor="#aaa" onPress={handleSkip}>
                    Skip
                </Button>
            </View>

            {/* Slide content */}
            <View style={styles.slideContainer}>
                <Text style={styles.emoji}>{slide.emoji}</Text>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
            </View>

            {/* Dots indicator */}
            <View style={styles.dotsContainer}>
                {TUTORIAL_SLIDES.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentSlide && styles.dotActive,
                        ]}
                    />
                ))}
            </View>

            {/* Next button */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={handleNext}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                >
                    {isLastSlide ? "Let's Go!" : 'Next'}
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    slideContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emoji: {
        fontSize: 100,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 18,
        color: '#bbb',
        textAlign: 'center',
        lineHeight: 28,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#444',
        marginHorizontal: 5,
    },
    dotActive: {
        backgroundColor: '#00ff88',
        width: 30,
    },
    footer: {
        padding: 30,
    },
    button: {
        backgroundColor: '#00ff88',
        borderRadius: 30,
        paddingVertical: 8,
    },
    buttonLabel: {
        color: '#1a1a2e',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
