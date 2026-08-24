import { argbFromHex, themeFromSourceColor, applyTheme, sourceColorFromImage, hexFromArgb } from "./material-color-utilities.js";

const character = document.getElementById('character');

function applySurfaceTokens(theme, isDark, target) {
    const neutral = theme.palettes.neutral;

    const surfaceTones = isDark ? {
        'surface-dim': neutral.tone(6),
        'surface-bright': neutral.tone(24),
        'surface-container-lowest': neutral.tone(4),
        'surface-container-low': neutral.tone(10),
        'surface-container': neutral.tone(12),
        'surface-container-high': neutral.tone(17),
        'surface-container-highest': neutral.tone(22),
    } : {
        'surface-dim': neutral.tone(87),
        'surface-bright': neutral.tone(98),
        'surface-container-lowest': neutral.tone(100),
        'surface-container-low': neutral.tone(96),
        'surface-container': neutral.tone(94),
        'surface-container-high': neutral.tone(92),
        'surface-container-highest': neutral.tone(90),
    };

    Object.entries(surfaceTones).forEach(([key, argb]) => {
        target.style.setProperty(`--md-sys-color-${key}`, hexFromArgb(argb));
    });
}

async function updateTheme() {
    if (!character) return;

    try {
        const sourceColor = await sourceColorFromImage(character);
        const theme = themeFromSourceColor(sourceColor);

        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(theme, { target: document.body, dark: systemDark });
        applySurfaceTokens(theme, systemDark, document.body);

        console.log(JSON.stringify(theme, null, 2));
    } catch (error) {
        console.error('Failed to update theme', error);
    }
}

if (character) {
    character.addEventListener('load', updateTheme);
    if (character.complete) {
        updateTheme();
    }
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', updateTheme);