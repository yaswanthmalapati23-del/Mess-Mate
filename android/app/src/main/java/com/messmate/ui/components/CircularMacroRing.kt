package com.messmate.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.messmate.ui.theme.*

@Composable
fun CircularMacroRing(
    calorieTarget: Int,
    calorieConsumed: Int,
    proteinTarget: Int,
    proteinConsumed: Float,
    carbsTarget: Int,
    carbsConsumed: Float,
    modifier: Modifier = Modifier
) {
    val calRatio = (calorieConsumed.toFloat() / maxOf(1, calorieTarget)).coerceIn(0f, 1f)
    val protRatio = (proteinConsumed / maxOf(1f, proteinTarget.toFloat())).coerceIn(0f, 1f)
    val carbRatio = (carbsConsumed / maxOf(1f, carbsTarget.toFloat())).coerceIn(0f, 1f)

    val animatedCal by animateFloatAsState(targetValue = calRatio, animationSpec = tween(700))
    val animatedProt by animateFloatAsState(targetValue = protRatio, animationSpec = tween(700))
    val animatedCarb by animateFloatAsState(targetValue = carbRatio, animationSpec = tween(700))

    val remainingKcal = maxOf(0, calorieTarget - calorieConsumed)

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier.size(200.dp)
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val strokeWidth = 10.dp.toPx()
            val center = Offset(size.width / 2, size.height / 2)

            val radiusCal = (size.width / 2) - strokeWidth - 4.dp.toPx()
            val radiusProt = radiusCal - strokeWidth - 6.dp.toPx()
            val radiusCarb = radiusProt - strokeWidth - 6.dp.toPx()

            // Background Track Arcs
            drawCircle(
                color = ObsidianBorder,
                radius = radiusCal,
                center = center,
                style = Stroke(strokeWidth)
            )
            drawCircle(
                color = ObsidianBorder,
                radius = radiusProt,
                center = center,
                style = Stroke(strokeWidth)
            )
            drawCircle(
                color = ObsidianBorder,
                radius = radiusCarb,
                center = center,
                style = Stroke(strokeWidth)
            )

            // Active Progress Arcs (-90 degrees is top)
            val startAngle = -90f

            drawArc(
                color = TerracottaPrimary,
                startAngle = startAngle,
                sweepAngle = animatedCal * 360f,
                useCenter = false,
                topLeft = Offset(center.x - radiusCal, center.y - radiusCal),
                size = Size(radiusCal * 2, radiusCal * 2),
                style = Stroke(strokeWidth, cap = StrokeCap.Round)
            )

            drawArc(
                color = SaffronPrimary,
                startAngle = startAngle,
                sweepAngle = animatedProt * 360f,
                useCenter = false,
                topLeft = Offset(center.x - radiusProt, center.y - radiusProt),
                size = Size(radiusProt * 2, radiusProt * 2),
                style = Stroke(strokeWidth, cap = StrokeCap.Round)
            )

            drawArc(
                color = OlivePrimary,
                startAngle = startAngle,
                sweepAngle = animatedCarb * 360f,
                useCenter = false,
                topLeft = Offset(center.x - radiusCarb, center.y - radiusCarb),
                size = Size(radiusCarb * 2, radiusCarb * 2),
                style = Stroke(strokeWidth, cap = StrokeCap.Round)
            )
        }

        // Center Display Typography
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = if (remainingKcal > 0) "REMAINING" else "TARGET MET",
                color = TextMuted,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Text(
                text = if (remainingKcal > 0) remainingKcal.toString() else calorieConsumed.toString(),
                color = TextWhite,
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                fontFamily = FontFamily.Serif
            )
            Text(
                text = "kcal of $calorieTarget",
                color = TextMuted,
                fontSize = 11.sp
            )
        }
    }
}
