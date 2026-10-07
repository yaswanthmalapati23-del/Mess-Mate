package com.messmate.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.Sparkles
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.messmate.ui.components.CircularMacroRing
import com.messmate.ui.theme.*

enum class QuantityIndicator { INCREASE, STANDARD, REDUCE, SKIP }

data class MealPlateItem(
    val id: String,
    val name: String,
    val recommendedServing: String,
    val indicator: QuantityIndicator,
    val indicatorLabel: String,
    val isMeasured: Boolean,
    val isTopPick: Boolean,
    val calories: Int,
    val protein: Float,
    val carbs: Float,
    val fat: Float,
    val quickReason: String,
    val fullReason: String
)

@Composable
fun TodayPlanScreen(
    onNavigateToMonth: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedSlot by remember { mutableStateOf("Lunch") }
    var expandedItemId by remember { mutableStateOf<String?>(null) }
    var isFullMealLogged by remember { mutableStateOf(false) }
    val loggedItems = remember { mutableStateListOf<String>() }

    // Full-Meal composition list showing ALL items available in today's lunch menu
    val lunchItems = remember {
        listOf(
            MealPlateItem(
                id = "dish_soya_curry",
                name = "High-Protein Soya Badi Curry",
                recommendedServing = "1.3 ladles (~195g)",
                indicator = QuantityIndicator.INCREASE,
                indicatorLabel = "↑ Increase",
                isMeasured = true,
                isTopPick = true,
                calories = 345,
                protein = 28.3f,
                carbs = 34.4f,
                fat = 8.3f,
                quickReason = "Elevated protein keeps you satiated in your deficit",
                fullReason = "Textured soy chunks provide the highest plant protein density (52%) to maintain lean muscle mass during deficit."
            ),
            MealPlateItem(
                id = "dish_tawa_roti",
                name = "Fresh Tawa Roti",
                recommendedServing = "2 medium phulkas (~60g)",
                indicator = QuantityIndicator.STANDARD,
                indicatorLabel = "✓ Standard",
                isMeasured = true,
                isTopPick = false,
                calories = 192,
                protein = 6.4f,
                carbs = 38.9f,
                fat = 1.0f,
                quickReason = "Clean 100% whole wheat complex carbs",
                fullReason = "Zero oil whole wheat rotis provide steady glycogen replenishment without spiking insulin."
            ),
            MealPlateItem(
                id = "dish_steamed_rice",
                name = "Steamed White Rice",
                recommendedServing = "0.6 ladle (~90g)",
                indicator = QuantityIndicator.REDUCE,
                indicatorLabel = "↓ Reduce",
                isMeasured = true,
                isTopPick = false,
                calories = 107,
                protein = 2.4f,
                carbs = 23.5f,
                fat = 0.2f,
                quickReason = "Reduced portion to keep calorie deficit",
                fullReason = "Portion trimmed to prevent excess refined starch while keeping meal volume satisfying."
            ),
            MealPlateItem(
                id = "dish_toor_dal",
                name = "Home-style Dal Tadka",
                recommendedServing = "1 ladle (~150ml)",
                indicator = QuantityIndicator.STANDARD,
                indicatorLabel = "✓ Standard",
                isMeasured = true,
                isTopPick = false,
                calories = 158,
                protein = 8.2f,
                carbs = 24.1f,
                fat = 3.6f,
                quickReason = "Slow-digesting legumes with essential amino acids",
                fullReason = "Slow-simmered arhar dal tempered with garlic and cumin provides soluble fiber and steady digestion."
            ),
            MealPlateItem(
                id = "dish_mess_curd",
                name = "Fresh Mess Curd / Dahi",
                recommendedServing = "1 steel katori (~100g)",
                indicator = QuantityIndicator.STANDARD,
                indicatorLabel = "✓ Standard",
                isMeasured = true,
                isTopPick = false,
                calories = 60,
                protein = 3.1f,
                carbs = 4.4f,
                fat = 3.5f,
                quickReason = "Probiotics aid campus digestion and cool the plate",
                fullReason = "Live lactic cultures improve gut flora bioavailability of legumes."
            )
        )
    }

    val totalCalories = lunchItems.sumOf { it.calories }
    val totalProtein = lunchItems.map { it.protein }.sum()

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(ObsidianBase)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item { Spacer(modifier = Modifier.height(4.dp)) }

        // Top Concentric Circular Macro Ring
        item {
            Card(
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = ObsidianSurface),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, ObsidianBorder, RoundedCornerShape(28.dp))
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Color(0x33C85A32),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0x4DC85A32))
                        ) {
                            Text(
                                text = "DAY 14 OF 30",
                                color = TerracottaLight,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }

                        Text(
                            text = "Target: 2,150 kcal",
                            color = SaffronPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    CircularMacroRing(
                        calorieTarget = 2150,
                        calorieConsumed = if (isFullMealLogged) 862 else 0,
                        proteinTarget = 140,
                        proteinConsumed = if (isFullMealLogged) 48.4f else 0f,
                        carbsTarget = 260,
                        carbsConsumed = if (isFullMealLogged) 125.3f else 0f
                    )
                }
            }
        }

        // Meal Slot Tabs
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(ObsidianSurface, RoundedCornerShape(16.dp))
                    .border(1.dp, ObsidianBorder, RoundedCornerShape(16.dp))
                    .padding(4.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                listOf("Breakfast", "Lunch", "Snacks", "Dinner").forEach { slot ->
                    val isSelected = selectedSlot == slot
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) TerracottaPrimary else Color.Transparent)
                            .clickable { selectedSlot = slot }
                            .padding(vertical = 9.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = slot,
                            color = if (isSelected) TextWhite else TextMuted,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }
        }

        // Full Meal Header Card
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = ObsidianCard),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, ObsidianBorder, RoundedCornerShape(20.dp))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "FULL MEAL COMPOSITION",
                                color = TextMuted,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "Today's $selectedSlot",
                                color = TextWhite,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                fontFamily = FontFamily.Serif
                            )
                        }

                        Surface(
                            shape = CircleShape,
                            color = SaffronSurface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0x66E09F3E))
                        ) {
                            Text(
                                text = "86% FIT",
                                color = SaffronLight,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Counter: 12:30 PM – 2:30 PM",
                            color = TextMuted,
                            fontSize = 11.sp
                        )
                        Text(
                            text = "$totalCalories kcal • ${totalProtein.toInt()}g protein",
                            color = TextWhite,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Scrollable List of ALL items in this meal
        items(lunchItems) { item ->
            val isExpanded = expandedItemId == item.id
            val isLogged = loggedItems.contains(item.id) || isFullMealLogged

            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = ObsidianCard),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        1.dp,
                        if (item.isTopPick) Color(0x66E09F3E) else ObsidianBorder,
                        RoundedCornerShape(18.dp)
                    )
                    .clickable { expandedItemId = if (isExpanded) null else item.id }
            ) {
                Column {
                    if (item.isTopPick) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0x33E09F3E))
                                .padding(horizontal = 12.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "⭐ TOP PICK FOR THIS MEAL",
                                color = SaffronLight,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = item.name,
                                    color = TextWhite,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                if (item.isMeasured) {
                                    Text(
                                        text = "✓ Measured",
                                        color = OliveLight,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(4.dp))

                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Text(
                                    text = item.recommendedServing,
                                    color = TextWhite,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium
                                )

                                Surface(
                                    shape = CircleShape,
                                    color = when (item.indicator) {
                                        QuantityIndicator.INCREASE -> SaffronSurface
                                        QuantityIndicator.REDUCE -> Color(0x33D97706)
                                        QuantityIndicator.SKIP -> Color(0x33DC2626)
                                        QuantityIndicator.STANDARD -> OliveSurface
                                    }
                                ) {
                                    Text(
                                        text = item.indicatorLabel,
                                        color = when (item.indicator) {
                                            QuantityIndicator.INCREASE -> SaffronLight
                                            QuantityIndicator.REDUCE -> Color(0xFFFBBF24)
                                            QuantityIndicator.SKIP -> Color(0xFFFCA5A5)
                                            QuantityIndicator.STANDARD -> OliveLight
                                        },
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = "💡 ${item.quickReason}",
                                color = TextMuted,
                                fontSize = 11.sp,
                                lineHeight = 15.sp
                            )
                        }

                        Column(
                            horizontalAlignment = Alignment.End,
                            modifier = Modifier.padding(start = 8.dp)
                        ) {
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = Color(0x14FFFFFF),
                                modifier = Modifier.padding(bottom = 6.dp)
                            ) {
                                Column(
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(text = "${item.calories} kcal", color = TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    Text(text = "${item.protein}g protein", color = SaffronLight, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                }
                            }

                            if (isLogged) {
                                Text(text = "✓ Logged", color = OliveLight, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            } else {
                                Button(
                                    onClick = { loggedItems.add(item.id) },
                                    colors = ButtonDefaults.buttonColors(containerColor = TerracottaPrimary),
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                    modifier = Modifier.height(28.dp)
                                ) {
                                    Text(text = "I Ate This", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }

                    if (isExpanded) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0x0AFFFFFF))
                                .padding(12.dp)
                        ) {
                            Text(
                                text = item.fullReason,
                                color = TextWhite,
                                fontSize = 11.sp,
                                lineHeight = 16.sp
                            )
                        }
                    }
                }
            }
        }

        // Single "Log Full Meal" Button
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Button(
                onClick = { isFullMealLogged = true },
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isFullMealLogged) OlivePrimary else TerracottaPrimary
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
            ) {
                Icon(
                    imageVector = if (isFullMealLogged) Icons.Default.DoneAll else Icons.Default.Check,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isFullMealLogged) "Full Plate Logged ($totalCalories kcal)" else "Log Full Meal ($totalCalories kcal • ${totalProtein.toInt()}g Protein)",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
