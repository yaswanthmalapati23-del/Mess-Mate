package com.messmate.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// ====================================================================
// NOURISH BOTANICAL MODERN COLOR PALETTE (From Google Stitch Mess Mate)
// ====================================================================

// Core Botanical Chroma
val NourishForestGreen = Color(0xFF1B5E4A)
val NourishDeepPine = Color(0xFF004534)
val NourishSoftMint = Color(0xFFD8E8DE)
val NourishMintContainer = Color(0xFFD6E6DC)
val NourishMintFixed = Color(0xFFAEF0D6)

// Surfaces & Backgrounds
val NourishWarmCream = Color(0xFFFBF9F4)
val NourishSurfaceWhite = Color(0xFFFFFFFF)
val NourishSurfaceContainerLow = Color(0xFFF5F3EE)
val NourishSurfaceContainer = Color(0xFFF0EEE9)
val NourishSurfaceContainerHigh = Color(0xFFEAE8E3)

// Text & Structural Lines
val NourishTextDark = Color(0xFF143026)
val NourishTextSecondary = Color(0xFF5F7A6E)
val NourishTextOnSurfaceVariant = Color(0xFF404944)
val NourishOutline = Color(0xFFA9BFB5)
val NourishOutlineLight = Color(0x66A9BFB5) // 40% alpha for card seams

// Status & Alerts
val NourishError = Color(0xFFBA1A1A)
val NourishErrorContainer = Color(0xFFFFDAD6)

// Stitch Light Color Scheme
val NourishLightColorScheme = lightColorScheme(
    primary = NourishForestGreen,
    onPrimary = Color.White,
    primaryContainer = NourishDeepPine,
    onPrimaryContainer = Color(0xFF94D5BC),
    secondary = NourishTextSecondary,
    onSecondary = Color.White,
    secondaryContainer = NourishSoftMint,
    onSecondaryContainer = NourishTextDark,
    background = NourishWarmCream,
    onBackground = NourishTextDark,
    surface = NourishSurfaceWhite,
    onSurface = NourishTextDark,
    surfaceVariant = NourishSurfaceContainerLow,
    onSurfaceVariant = NourishTextOnSurfaceVariant,
    outline = NourishOutlineLight,
    error = NourishError,
    errorContainer = NourishErrorContainer
)

// ====================================================================
// NOURISH BOTANICAL TYPOGRAPHY SPECIFICATIONS
// ====================================================================
val NourishTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 36.sp,
        lineHeight = 44.sp,
        letterSpacing = (-0.02).sp
    ),
    headlineLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 36.sp,
        letterSpacing = (-0.015).sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        lineHeight = 28.sp
    ),
    headlineSmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 24.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 22.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.01.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 18.sp
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.02.sp
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.03.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 14.sp,
        letterSpacing = 0.04.sp
    )
)
