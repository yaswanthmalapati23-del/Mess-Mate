package com.messmate.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.messmate.ui.theme.*

// ====================================================================
// 1. ARCH CANOPY HERO CARD (Signature Nourish Architectural Dome Motif)
// ====================================================================
/**
 * Signature dome container featuring rounded-t-[36px] rounded-b-[24px].
 * Inspired by restorative collegiate architecture with natural ambient elevation.
 */
@Composable
fun ArchCanopyHeroCard(
    modifier: Modifier = Modifier,
    backgroundColor: Color = NourishSurfaceWhite,
    topArchRadius: Dp = 36.dp,
    bottomRadius: Dp = 24.dp,
    elevation: Dp = 4.dp,
    content: @Composable ColumnScope.() -> Unit
) {
    val cardShape = RoundedCornerShape(
        topStart = topArchRadius,
        topEnd = topArchRadius,
        bottomStart = bottomRadius,
        bottomEnd = bottomRadius
    )

    Card(
        modifier = modifier
            .fillMaxWidth()
            .shadow(
                elevation = elevation,
                shape = cardShape,
                ambientColor = NourishTextDark.copy(alpha = 0.06f),
                spotColor = NourishTextDark.copy(alpha = 0.08f)
            ),
        shape = cardShape,
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Box(modifier = Modifier.fillMaxWidth()) {
            // Subtle decorative organic leaf contour in background
            Canvas(
                modifier = Modifier
                    .size(110.dp)
                    .align(Alignment.TopEnd)
                    .offset(x = 24.dp, y = (-24).dp)
            ) {
                drawCircle(
                    color = NourishForestGreen.copy(alpha = 0.035f),
                    radius = size.minDimension / 1.1f
                )
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                content = content
            )
        }
    }
}

// ====================================================================
// 2. CIRCULAR FUEL GAUGE
// ====================================================================
/**
 * Circular progress ring displaying consumed calories against target.
 * Uses soft mint background arc and deep forest green animated progress arc.
 */
@Composable
fun CircularFuelGauge(
    currentCalories: Int,
    targetCalories: Int,
    modifier: Modifier = Modifier,
    sizeDp: Dp = 104.dp,
    strokeWidth: Dp = 10.dp
) {
    val progress = if (targetCalories > 0) {
        (currentCalories.toFloat() / targetCalories.toFloat()).coerceIn(0f, 1f)
    } else 0f

    val animatedProgress by animateFloatAsState(
        targetValue = progress,
        animationSpec = tween(durationMillis = 1000),
        label = "FuelProgress"
    )

    val percentInt = (progress * 100).toInt()

    Box(
        modifier = modifier.size(sizeDp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val strokePx = strokeWidth.toPx()
            val arcSize = size.minDimension - strokePx
            val topLeft = Offset(strokePx / 2f, strokePx / 2f)

            // Background Track
            drawArc(
                color = NourishSoftMint.copy(alpha = 0.55f),
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft,
                size = Size(arcSize, arcSize),
                style = Stroke(width = strokePx, cap = StrokeCap.Round)
            )

            // Foreground Progress Arc
            drawArc(
                brush = Brush.sweepGradient(
                    colors = listOf(NourishForestGreen, NourishDeepPine, NourishForestGreen)
                ),
                startAngle = -90f,
                sweepAngle = 360f * animatedProgress,
                useCenter = false,
                topLeft = topLeft,
                size = Size(arcSize, arcSize),
                style = Stroke(width = strokePx, cap = StrokeCap.Round)
            )
        }

        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.Eco,
                contentDescription = null,
                tint = NourishForestGreen,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "$percentInt%",
                style = NourishTypography.labelMedium,
                fontWeight = FontWeight.Bold,
                color = NourishTextDark
            )
        }
    }
}

// ====================================================================
// 3. NUMBERED MINT BADGE
// ====================================================================
/**
 * 36x36dp circular token with Soft Mint background (#D8E8DE)
 * and deep bold forest green numeral or icon.
 */
@Composable
fun NumberedMintBadge(
    number: Int,
    modifier: Modifier = Modifier,
    size: Dp = 36.dp
) {
    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(NourishSoftMint),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = number.toString(),
            style = NourishTypography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = NourishForestGreen
        )
    }
}

// ====================================================================
// 4. MACRO PROGRESS TILE
// ====================================================================
/**
 * Modern tile showing icon, macro name (Carbs, Protein, Fats),
 * current/target in grams, and proportional progress bar.
 */
@Composable
fun MacroProgressTile(
    label: String,
    currentGrams: Int,
    targetGrams: Int,
    icon: ImageVector,
    barColor: Color,
    iconBgColor: Color,
    iconTint: Color,
    modifier: Modifier = Modifier
) {
    val progress = if (targetGrams > 0) {
        (currentGrams.toFloat() / targetGrams.toFloat()).coerceIn(0f, 1f)
    } else 0f

    Card(
        modifier = modifier,
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = NourishSurfaceWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 10.dp, horizontal = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(30.dp)
                    .clip(CircleShape)
                    .background(iconBgColor),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = label,
                    tint = iconTint,
                    modifier = Modifier.size(16.dp)
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = label,
                style = NourishTypography.labelSmall,
                color = NourishTextSecondary
            )

            Row(
                verticalAlignment = Alignment.Bottom,
                modifier = Modifier.padding(top = 2.dp)
            ) {
                Text(
                    text = "$currentGrams",
                    style = NourishTypography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = NourishTextDark
                )
                Text(
                    text = "/${targetGrams}g",
                    style = NourishTypography.labelSmall.copy(fontSize = 10.sp),
                    color = NourishTextSecondary,
                    modifier = Modifier.padding(start = 1.dp, bottom = 1.dp)
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Rounded Progress Track
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(5.dp)
                    .clip(RoundedCornerShape(3.dp))
                    .background(NourishSoftMint.copy(alpha = 0.5f))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(fraction = progress)
                        .fillMaxHeight()
                        .clip(RoundedCornerShape(3.dp))
                        .background(barColor)
                )
            }
        }
    }
}

// ====================================================================
// 5. SMART SWAP CARD
// ====================================================================
/**
 * Non-Veg / Protein Smart Swap card allowing students to exchange
 * a menu item for higher protein (e.g. Aloo Gobi -> Boiled Egg Curry).
 */
@Composable
fun SmartSwapCard(
    title: String,
    subtitle: String,
    swapDeltaText: String,
    badgeText: String = "Non-Veg Counter",
    counterSlot: String = "Slot 3B",
    modifier: Modifier = Modifier,
    onSwapClick: () -> Unit
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = NourishSurfaceWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 10.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.SwapHoriz,
                    contentDescription = null,
                    tint = NourishForestGreen,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Non-Veg Smart Swap",
                    style = NourishTypography.titleLarge,
                    color = NourishForestGreen,
                    fontWeight = FontWeight.Bold
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Item preview avatar/badge
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(NourishSurfaceContainerLow),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "🥚",
                        fontSize = 26.sp
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = title,
                            style = NourishTypography.titleMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = NourishTextDark,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.weight(1f)
                        )
                        Button(
                            onClick = onSwapClick,
                            shape = CircleShape,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = NourishSoftMint,
                                contentColor = NourishForestGreen
                            ),
                            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                            modifier = Modifier.height(32.dp)
                        ) {
                            Text(
                                text = "Swap",
                                style = NourishTypography.labelMedium,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Text(
                        text = subtitle,
                        style = NourishTypography.bodySmall,
                        color = NourishTextOnSurfaceVariant,
                        modifier = Modifier.padding(top = 2.dp)
                    )

                    Row(
                        modifier = Modifier.padding(top = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(NourishErrorContainer)
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = badgeText,
                                style = NourishTypography.labelSmall,
                                fontWeight = FontWeight.SemiBold,
                                color = NourishError
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = counterSlot,
                            style = NourishTypography.labelSmall,
                            color = NourishTextSecondary
                        )
                    }
                }
            }
        }
    }
}

// ====================================================================
// 6. GUIDED PLATE ITEM CHECKLIST CARD
// ====================================================================
@Composable
fun GuidedPlateItemCard(
    name: String,
    portion: String,
    calories: Int,
    protein: Int,
    carbs: Int,
    badge: String? = null,
    isSelected: Boolean,
    onToggle: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onToggle() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = NourishSurfaceWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Checked/Unchecked indicator
            Box(
                modifier = Modifier
                    .size(26.dp)
                    .clip(CircleShape)
                    .background(if (isSelected) NourishForestGreen else NourishSurfaceContainerLow)
                    .border(
                        width = 1.dp,
                        color = if (isSelected) NourishForestGreen else NourishOutline,
                        shape = CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (isSelected) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = "Selected",
                        tint = Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = name,
                        style = NourishTypography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = NourishTextDark
                    )
                    badge?.let {
                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(NourishSoftMint)
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = it,
                                style = NourishTypography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = NourishForestGreen
                            )
                        }
                    }
                }

                Text(
                    text = portion,
                    style = NourishTypography.bodySmall,
                    color = NourishTextSecondary,
                    modifier = Modifier.padding(top = 2.dp)
                )

                Row(
                    modifier = Modifier.padding(top = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "$calories kcal",
                        style = NourishTypography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = NourishForestGreen
                    )
                    Text(
                        text = "• ${protein}g Protein",
                        style = NourishTypography.labelMedium,
                        color = NourishTextOnSurfaceVariant
                    )
                    Text(
                        text = "• ${carbs}g Carbs",
                        style = NourishTypography.labelMedium,
                        color = NourishTextSecondary
                    )
                }
            }
        }
    }
}

// ====================================================================
// 7. FOOD COURT ITEM CARD
// ====================================================================
@Composable
fun FoodCourtItemCard(
    name: String,
    outlet: String,
    location: String,
    price: Int,
    calories: Int,
    protein: Int,
    isVeg: Boolean,
    tag: String? = null,
    modifier: Modifier = Modifier,
    onAddClick: () -> Unit
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = NourishSurfaceWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // Food Card Banner / Placeholder
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                NourishSurfaceContainerHigh,
                                NourishSurfaceContainerLow
                            )
                        )
                    )
                    .padding(12.dp)
            ) {
                // Veg / Non-Veg Indicator
                Row(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(NourishSurfaceWhite.copy(alpha = 0.92f))
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(if (isVeg) Color(0xFF059669) else Color(0xFFB45309))
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isVeg) "Veg Delicacy" else "Non-Veg Pick",
                        style = NourishTypography.labelSmall,
                        fontWeight = FontWeight.SemiBold,
                        color = NourishTextDark
                    )
                }

                tag?.let {
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .clip(CircleShape)
                            .background(NourishForestGreen)
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = it,
                            style = NourishTypography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }

            // Body
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = name,
                            style = NourishTypography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = NourishTextDark
                        )
                        Text(
                            text = "$outlet • $location",
                            style = NourishTypography.bodySmall,
                            color = NourishTextSecondary,
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }
                    Text(
                        text = "₹$price",
                        style = NourishTypography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = NourishForestGreen
                    )
                }

                // Macro badges
                Row(
                    modifier = Modifier.padding(top = 10.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(NourishSurfaceContainerLow)
                            .padding(horizontal = 10.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "$calories kcal",
                            style = NourishTypography.labelMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = NourishTextDark
                        )
                    }
                    Box(
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(NourishSurfaceContainerLow)
                            .padding(horizontal = 10.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "${protein}g Protein",
                            style = NourishTypography.labelMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = NourishTextSecondary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Bottom Action
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(NourishSoftMint)
                            .padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = NourishForestGreen,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Fits calorie deficit",
                            style = NourishTypography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = NourishForestGreen
                        )
                    }

                    Button(
                        onClick = onAddClick,
                        shape = CircleShape,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = NourishForestGreen,
                            contentColor = Color.White
                        ),
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                        modifier = Modifier.height(38.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Add Item",
                            style = NourishTypography.labelMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

// ====================================================================
// 8. NOURISH PILL BUTTON
// ====================================================================
@Composable
fun NourishPillButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    backgroundColor: Color = NourishForestGreen,
    contentColor: Color = Color.White,
    height: Dp = 50.dp
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .height(height),
        shape = CircleShape,
        colors = ButtonDefaults.buttonColors(
            containerColor = backgroundColor,
            contentColor = contentColor
        ),
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 3.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            icon?.let {
                Icon(
                    imageVector = it,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text(
                text = text,
                style = NourishTypography.labelLarge,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

// ====================================================================
// 9. NOURISH CATEGORY CHIP
// ====================================================================
@Composable
fun NourishChip(
    text: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(CircleShape)
            .background(if (isSelected) NourishForestGreen else NourishSurfaceWhite)
            .border(
                width = 1.dp,
                color = if (isSelected) NourishForestGreen else NourishOutlineLight,
                shape = CircleShape
            )
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            style = NourishTypography.labelMedium,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = if (isSelected) Color.White else NourishTextSecondary
        )
    }
}
