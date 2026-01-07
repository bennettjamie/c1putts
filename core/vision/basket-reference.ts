/**
 * Disc Golf Basket Reference Dimensions
 * 
 * PDGA Championship Specifications
 * Used for distance estimation via computer vision.
 */

export const BASKET_DIMENSIONS = {
    // All measurements in inches
    TOTAL_HEIGHT: 52,        // A: From ground to top of band
    POLE_HEIGHT: 30,         // B: Pole from ground to basket bottom
    CHAIN_LENGTH: 18,        // C: Chain assembly height
    BASKET_DEPTH: 10,        // D: Catching basket depth
    TOP_BAND_HEIGHT: 4,      // E: Yellow/colored top band
    TOP_BAND_DIAMETER: 23,   // F: Diameter of top band
    BASE_DIAMETER: 28,       // G: Base width

    // Converted to feet for distance calculations
    TOTAL_HEIGHT_FT: 52 / 12, // ~4.33 ft
    TOP_BAND_DIAMETER_FT: 23 / 12, // ~1.92 ft
};

/**
 * Basket parts for YOLO detection
 */
export const BASKET_PARTS = {
    TOP_BAND: 'top_band',      // Yellow/colored ring at top
    CHAINS: 'chains',          // Chain assembly
    BASKET: 'basket',          // Catching basket/tray
    POLE: 'pole',              // Center pole
    BASE: 'base',              // Ground base
};

/**
 * Player reference for distance estimation
 */
export interface PlayerCalibration {
    heightInches: number;
    heightFeet: number;
}

/**
 * Estimate distance from basket using known dimensions
 * 
 * Uses the top band diameter (23") as reference.
 * If we know the pixel width of the band and the actual width,
 * we can estimate distance using perspective geometry.
 */
export function estimateDistanceFromBasket(
    topBandPixelWidth: number,
    imageWidth: number,
    cameraFOV: number = 70 // degrees, typical phone camera
): number {
    // Known: top band is 23 inches wide
    const BAND_WIDTH_INCHES = 23;

    // Calculate apparent angular size
    const pixelRatio = topBandPixelWidth / imageWidth;
    const apparentAngle = pixelRatio * cameraFOV;

    // Distance = (actual width / 2) / tan(apparent angle / 2)
    const radians = (apparentAngle * Math.PI) / 180;
    const distanceInches = (BAND_WIDTH_INCHES / 2) / Math.tan(radians / 2);
    const distanceFeet = distanceInches / 12;

    return Math.round(distanceFeet);
}

/**
 * Popular basket models (for training variation)
 */
export const BASKET_MODELS = [
    'DGA Mach X',
    'Innova DISCatcher Pro',
    'Dynamic Discs Recruit',
    'MVP Black Hole Pro',
    'Prodigy T1',
    'Latitude 64 ProBasket',
    'Axiom Pro HD',
    'Gateway Titan',
];
