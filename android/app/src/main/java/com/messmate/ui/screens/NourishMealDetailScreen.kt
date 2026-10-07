package com.messmate.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.messmate.ui.components.*
import com.messmate.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NourishMealDetailScreen(
    onBackClick: () -> Unit = {},
    onLogMealSuccess: () -> Unit = {}
) {
    var isEggSwapped by remember { mutableStateOf(false) }
    var itemRiceSelected by remember { mutableStateOf(true) }
    var itemDalSelected by remember { mutableStateOf(true) }
    var itemBhindiSelected by remember { mutableStateOf(true) }
    var itemCurdSelected by remember { mutableStateOf(true) }

    // Dynamic Macro calculation
    val baseCalories = 640
    val activeCalories = (if (itemRiceSelected) 156 else 0) +
            (if (itemDalSelected) 185 else 0) +
            (if (itemBhindiSelected) 95 else 0) +
            (if (itemCurdSelected) 60 else 0) +
            (if (isEggSwapped) 144 else 0)

    val activeProtein = (if (itemRiceSelected) 3 else 0) +
            (if (itemDalSelected) 12 else 0) +
            (if (itemBhindiSelected) 2 else 0) +
            (if (itemCurdSelected) 4 else 0) +
            (if (isEggSwapped) 14 else 0)

    val activeCarbs = (if (itemRiceSelected) 35 else 0) +
            (if (itemDalSelected) 22 else 0) +
            (if (itemBhindiSelected) 12 else 0) +
            (if (itemCurdSelected) 4 else 0) +
            (if (isEggSwapped) 2 else 0)

    val activeFats = 18 + (if (isEggSwapped) 6 else 0)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Meal Details",
                        style = NourishTypography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = NourishTextDark
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Back",
                            tint = NourishTextDark
                        )
                    }
                },
                actions = {
                    Box(
                        modifier = Modifier
                            .padding(end = 12.dp)
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(NourishForestGreen),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = "Profile",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = NourishWarmCream
                )
            )
        },
        bottomBar = {
            Surface(
                color = NourishWarmCream,
                shadowElevation = 8.dp
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    NourishPillButton(
                        text = "Log this Plate ($activeCalories kcal)",
                        icon = Icons.Default.CheckCircle,
                        onClick = onLogMealSuccess
                    )
                }
            }
        },
        containerColor = NourishWarmCream
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(top = 8.dp, bottom = 20.dp)
        ) {
            // Header Context
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(20.dp)
                                    .clip(CircleShape)
                                    .background(NourishSoftMint),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "MH",
                                    style = NourishTypography.labelSmall.copy(fontSize = 9.sp),
                                    fontWeight = FontWeight.ExtraBold,
                                    color = NourishForestGreen
                                )
                            }
                            Text(
                                text = "CENTRAL MESS • VIT-AP CAMPUS",
                                style = NourishTypography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = NourishTextSecondary,
                                letterSpacing = 0.5.sp
                            )
                        }
                        Text(
                            text = "South Indian Special",
                            style = NourishTypography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = NourishForestGreen,
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }

                    Row(
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(NourishSoftMint)
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.DateRange,
                            contentDescription = null,
                            tint = NourishForestGreen,
                            modifier = Modifier.size(14.dp)
                        )
                        Text(
                            text = "12:30 - 2:30 PM",
                            style = NourishTypography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = NourishForestGreen
                        )
                    }
                }
            }

            // Arch Canopy Suggested Serving Card
            item {
                ArchCanopyHeroCard(
                    topArchRadius = 36.dp,
                    bottomRadius = 24.dp
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "SUGGESTED SERVING",
                                style = NourishTypography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = NourishTextSecondary,
                                letterSpacing = 1.sp
                            )
                            Row(
                                verticalAlignment = Alignment.Bottom,
                                modifier = Modifier.padding(top = 2.dp)
                            ) {
                                Text(
                                    text = "$activeCalories",
                                    style = NourishTypography.displayLarge.copy(fontSize = 34.sp),
                                    fontWeight = FontWeight.ExtraBold,
                                    color = NourishForestGreen
                                )
                                Text(
                                    text = " kcal",
                                    style = NourishTypography.titleLarge,
                                    color = NourishForestGreen.copy(alpha = 0.8f),
                                    modifier = Modifier.padding(bottom = 4.dp, start = 4.dp)
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(NourishForestGreen)
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Eco,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(14.dp)
                                )
                                Text(
                                    text = "Target Plate",
                                    style = NourishTypography.labelMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // 3-Column Macro Row
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(18.dp))
                            .background(NourishSurfaceContainerLow)
                            .padding(8.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        MacroProgressTile(
                            label = "Protein",
                            currentGrams = activeProtein,
                            targetGrams = 35,
                            icon = Icons.Default.FitnessCenter,
                            barColor = NourishForestGreen,
                            iconBgColor = NourishMintFixed,
                            iconTint = NourishForestGreen,
                            modifier = Modifier.weight(1f)
                        )
                        MacroProgressTile(
                            label = "Carbs",
                            currentGrams = activeCarbs,
                            targetGrams = 90,
                            icon = Icons.Default.Eco,
                            barColor = NourishTextSecondary,
                            iconBgColor = NourishSoftMint,
                            iconTint = NourishForestGreen,
                            modifier = Modifier.weight(1f)
                        )
                        MacroProgressTile(
                            label = "Fats",
                            currentGrams = activeFats,
                            targetGrams = 25,
                            icon = Icons.Default.Opacity,
                            barColor = NourishTextSecondary,
                            iconBgColor = NourishSurfaceContainerHigh,
                            iconTint = NourishTextSecondary,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Dietitian Note
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(NourishSoftMint.copy(alpha = 0.7f))
                            .padding(12.dp),
                        verticalAlignment = Alignment.Top,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(NourishSurfaceWhite),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Lightbulb,
                                contentDescription = null,
                                tint = NourishForestGreen,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        Column {
                            Text(
                                text = "VIT-AP Dietitian Note",
                                style = NourishTypography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = NourishForestGreen
                            )
                            Text(
                                text = "Today's Dal Tadka is high in lentil protein. Avoid extra ghee on phulkas to stay cleanly within your lunch fat allowance.",
                                style = NourishTypography.bodySmall,
                                color = NourishTextOnSurfaceVariant,
                                modifier = Modifier.padding(top = 2.dp)
                            )
                        }
                    }
                }
            }

            // Non-Veg Smart Swap Module
            item {
                SmartSwapCard(
                    title = "Boiled Egg Curry (2 eggs)",
                    subtitle = "Swap out Aloo Gobi for +12g protein (+45 kcal).",
                    swapDeltaText = "+12g protein",
                    badgeText = "Non-Veg Counter",
                    counterSlot = "Slot 3B",
                    onSwapClick = { isEggSwapped = !isEggSwapped }
                )
            }

            // Guided Campus Plate Header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(text = "🍽️", fontSize = 16.sp)
                        Text(
                            text = "Guided Campus Plate",
                            style = NourishTypography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = NourishForestGreen
                        )
                    }
                    Text(
                        text = "Tap item to log",
                        style = NourishTypography.labelSmall,
                        color = NourishTextSecondary
                    )
                }
            }

            // Guided Plate Items
            item {
                GuidedPlateItemCard(
                    name = "Steamed Sona Masoori Rice",
                    portion = "Recommended: 1 standard katori (120g)",
                    calories = 156,
                    protein = 3,
                    carbs = 35,
                    isSelected = itemRiceSelected,
                    onToggle = { itemRiceSelected = !itemRiceSelected }
                )
            }

            item {
                GuidedPlateItemCard(
                    name = "Yellow Dal Tadka",
                    portion = "Recommended: 1.5 katori (generous)",
                    calories = 185,
                    protein = 12,
                    carbs = 22,
                    badge = "Key Protein Source",
                    isSelected = itemDalSelected,
                    onToggle = { itemDalSelected = !itemDalSelected }
                )
            }

            item {
                GuidedPlateItemCard(
                    name = "Bhindi Masala (Okra)",
                    portion = "Recommended: 1 katori (100g)",
                    calories = 95,
                    protein = 2,
                    carbs = 12,
                    isSelected = itemBhindiSelected,
                    onToggle = { itemBhindiSelected = !itemBhindiSelected }
                )
            }

            item {
                GuidedPlateItemCard(
                    name = "Low-fat Fresh Curd",
                    portion = "Recommended: 1 small cup (100g)",
                    calories = 60,
                    protein = 4,
                    carbs = 4,
                    isSelected = itemCurdSelected,
                    onToggle = { itemCurdSelected = !itemCurdSelected }
                )
            }
        }
    }
}
