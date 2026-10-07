package com.messmate.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = TerracottaPrimary,
    onPrimary = TextWhite,
    primaryContainer = TerracottaDark,
    secondary = SaffronPrimary,
    onSecondary = ObsidianBase,
    secondaryContainer = SaffronSurface,
    tertiary = OlivePrimary,
    onTertiary = TextWhite,
    tertiaryContainer = OliveContainer,
    background = ObsidianBase,
    onBackground = TextWhite,
    surface = ObsidianSurface,
    onSurface = TextWhite,
    surfaceVariant = ObsidianCard,
    onSurfaceVariant = TextMuted,
    outline = ObsidianBorder
)

private val LightColorScheme = lightColorScheme(
    primary = TerracottaPrimary,
    onPrimary = TextWhite,
    primaryContainer = TerracottaLight,
    secondary = SaffronPrimary,
    onSecondary = TextWhite,
    tertiary = OlivePrimary,
    onTertiary = TextWhite,
    background = ParchmentBase,
    onBackground = TextDark,
    surface = ParchmentSurface,
    onSurface = TextDark,
    outline = ParchmentBorder
)

@Composable
fun MessMateTheme(
    darkTheme: Boolean = true, // Default to first-class dark mode
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
