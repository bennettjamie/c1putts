/**
 * React Native Paper Theme
 * 
 * Applies design tokens to Material Design theme.
 */

import { MD3DarkTheme, configureFonts } from 'react-native-paper';
import { tokens } from './tokens';

// Font configuration
const fontConfig = {
    displayLarge: {
        fontFamily: tokens.typography.heading,
        fontSize: 57,
        fontWeight: '700' as const,
        letterSpacing: 0,
        lineHeight: 64,
    },
    displayMedium: {
        fontFamily: tokens.typography.heading,
        fontSize: 45,
        fontWeight: '700' as const,
        letterSpacing: 0,
        lineHeight: 52,
    },
    displaySmall: {
        fontFamily: tokens.typography.heading,
        fontSize: 36,
        fontWeight: '700' as const,
        letterSpacing: 0,
        lineHeight: 44,
    },
    headlineLarge: {
        fontFamily: tokens.typography.heading,
        fontSize: 32,
        fontWeight: '700' as const,
        letterSpacing: 0,
        lineHeight: 40,
    },
    headlineMedium: {
        fontFamily: tokens.typography.heading,
        fontSize: 28,
        fontWeight: '700' as const,
        letterSpacing: 0,
        lineHeight: 36,
    },
    headlineSmall: {
        fontFamily: tokens.typography.heading,
        fontSize: 24,
        fontWeight: '700' as const,
        letterSpacing: 0,
        lineHeight: 32,
    },
    titleLarge: {
        fontFamily: tokens.typography.heading,
        fontSize: 22,
        fontWeight: '700' as const,
        letterSpacing: 0,
        lineHeight: 28,
    },
    titleMedium: {
        fontFamily: tokens.typography.body,
        fontSize: 16,
        fontWeight: '500' as const,
        letterSpacing: 0.15,
        lineHeight: 24,
    },
    titleSmall: {
        fontFamily: tokens.typography.body,
        fontSize: 14,
        fontWeight: '500' as const,
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    bodyLarge: {
        fontFamily: tokens.typography.body,
        fontSize: 16,
        fontWeight: '400' as const,
        letterSpacing: 0.15,
        lineHeight: 24,
    },
    bodyMedium: {
        fontFamily: tokens.typography.body,
        fontSize: 14,
        fontWeight: '400' as const,
        letterSpacing: 0.25,
        lineHeight: 20,
    },
    bodySmall: {
        fontFamily: tokens.typography.body,
        fontSize: 12,
        fontWeight: '400' as const,
        letterSpacing: 0.4,
        lineHeight: 16,
    },
    labelLarge: {
        fontFamily: tokens.typography.body,
        fontSize: 14,
        fontWeight: '500' as const,
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    labelMedium: {
        fontFamily: tokens.typography.body,
        fontSize: 12,
        fontWeight: '500' as const,
        letterSpacing: 0.5,
        lineHeight: 16,
    },
    labelSmall: {
        fontFamily: tokens.typography.body,
        fontSize: 11,
        fontWeight: '500' as const,
        letterSpacing: 0.5,
        lineHeight: 16,
    },
};

export const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: tokens.colors.brand,
        primaryContainer: tokens.colors.brandDark,
        secondary: tokens.colors.info,
        secondaryContainer: tokens.colors.info,
        tertiary: tokens.colors.warning,
        background: tokens.colors.background,
        surface: tokens.colors.surfaceSolid,
        surfaceVariant: tokens.colors.surface,
        error: tokens.colors.error,
        errorContainer: tokens.colors.error,
        onPrimary: tokens.colors.textOnBrand,
        onPrimaryContainer: tokens.colors.textOnBrand,
        onSecondary: tokens.colors.textPrimary,
        onBackground: tokens.colors.textPrimary,
        onSurface: tokens.colors.textPrimary,
        onSurfaceVariant: tokens.colors.textSecondary,
        onError: tokens.colors.textPrimary,
        outline: tokens.colors.border,
        outlineVariant: tokens.colors.border,
        inverseSurface: tokens.colors.textPrimary,
        inverseOnSurface: tokens.colors.background,
        inversePrimary: tokens.colors.brandDark,
        elevation: {
            level0: 'transparent',
            level1: tokens.colors.surfaceSolid,
            level2: tokens.colors.surfaceSolid,
            level3: tokens.colors.surfaceSolid,
            level4: tokens.colors.surfaceSolid,
            level5: tokens.colors.surfaceSolid,
        },
    },
    fonts: configureFonts({ config: fontConfig }),
};

export type AppTheme = typeof theme;
