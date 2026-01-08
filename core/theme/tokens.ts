/**
 * Design System Tokens
 * 
 * Shared across disc golf app family:
 * - C1Putts
 * - Hey Caddie!
 * - Hyzerlyzer
 * 
 * Source: https://github.com/bennettjamie/design-system
 */

export const tokens = {
    colors: {
        // Brand
        brand: '#CCFF00',           // Lime green (primary across all apps)
        brandDark: '#99CC00',       // Darker variant
        brandLight: '#E6FF66',      // Lighter variant

        // Backgrounds
        background: '#121212',      // Main dark background
        surface: 'rgba(255, 255, 255, 0.1)',  // Cards, overlays
        surfaceSolid: '#1E1E1E',    // Solid surface alternative

        // Semantic
        success: '#00E676',         // Makes, positive
        error: '#FF5252',           // Misses, negative
        warning: '#FFD740',         // Caution
        info: '#40C4FF',            // Information

        // Text
        textPrimary: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        textMuted: 'rgba(255, 255, 255, 0.5)',
        textOnBrand: '#121212',     // Text on brand color

        // Borders
        border: 'rgba(255, 255, 255, 0.1)',
        borderActive: '#CCFF00',
    },

    typography: {
        // Font families
        heading: 'Inter-Bold',
        body: 'Inter-Regular',
        data: 'JetBrainsMono-Bold',  // For numbers, stats

        // Font sizes
        sizes: {
            xs: 10,
            sm: 12,
            md: 14,
            lg: 16,
            xl: 18,
            '2xl': 24,
            '3xl': 32,
            '4xl': 48,
            '5xl': 64,
            display: 120,  // Big distance numbers
        },

        // Line heights
        lineHeights: {
            tight: 1.1,
            normal: 1.4,
            relaxed: 1.6,
        },
    },

    spacing: {
        xs: 4,
        sm: 8,      // Tight spacing
        md: 16,     // Standard spacing
        lg: 24,
        xl: 32,
        '2xl': 48,
    },

    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        full: 9999,
    },

    // Shadows
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
        },
    },
} as const;

// Convenience exports
export const colors = tokens.colors;
export const typography = tokens.typography;
export const spacing = tokens.spacing;
export const borderRadius = tokens.borderRadius;
