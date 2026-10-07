package com.messmate.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
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
fun NourishHomeScreen(
    onNavigateToMealDetail: () -> Unit = {},
    onNavigateToFoodCourt: () -> Unit = {},
    onNavigateToWeeklyMenu: () -> Unit = {},
    onNavigateToProfile: () -> Unit = {}
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(NourishForestGreen),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "🌿",
                                fontSize = 18.sp
                            )
                        }
                        Column {
                            Text(
                                text = "VIT-AP UNIVERSITY",
                                style = NourishTypography.labelSmall,
                                color = NourishTextSecondary,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "Home",
                                style = NourishTypography.titleLarge,
                                color = NourishTextDark,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = {}) {
                        Icon(
                            imageVector = Icons.Default.Notifications,
                            contentDescription = "Notifications",
                            tint = NourishTextSecondary
                        )
                    }
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
        containerColor = NourishWarmCream
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(top = 8.dp, bottom = 32.dp)
        ) {
            // ==========================================
            // 1. STUDENT HEADER & CONTEXT SUMMARY
            // ==========================================
            item {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Date Chip
                        Row(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(NourishSoftMint)
                                .padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.DateRange,
                                contentDescription = null,
                                tint = NourishForestGreen,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = "WED, 24 OCT",
                                style = NourishTypography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = NourishForestGreen
                            )
                        }

                        // Mess Open Status
                        Row(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(NourishSurfaceContainerHigh)
                                .padding(horizontal = 10.dp, vertical = 5.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(NourishForestGreen)
                            )
                            Text(
                                text = "Mess Open",
                                style = NourishTypography.labelSmall,
                                color = NourishTextSecondary,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Good afternoon, Aditi 👋",
                        style = NourishTypography.headlineLarge,
                        color = NourishTextDark
                    )

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        modifier = Modifier.padding(top = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.LocationOn,
                            contentDescription = null,
                            tint = NourishForestGreen,
                            modifier = Modifier.size(15.dp)
                        )
                        Text(
                            text = "VIT-AP Central Mess (Block-B, South Mess)",
                            style = NourishTypography.bodySmall,
                            color = NourishTextSecondary
                        )
                    }
                }
            }

            // ==========================================
            // 2. DAILY FUEL TRACKER ARCH CANOPY HERO
            // ==========================================
            item {
                ArchCanopyHeroCard(
                    topArchRadius = 36.dp,
                    bottomRadius = 24.dp
                ) {
                    // Header Bar
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .width(6.dp)
                                    .height(20.dp)
                                    .clip(RoundedCornerShape(3.dp))
                                    .background(NourishForestGreen)
                            )
                            Text(
                                text = "Daily Fuel Tracker",
                                style = NourishTypography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = NourishTextDark
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(NourishSoftMint)
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "680 kcal remaining",
                                style = NourishTypography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = NourishForestGreen
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // Gauge & Numerals Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(20.dp)
                    ) {
                        CircularFuelGauge(
                            currentCalories = 1420,
                            targetCalories = 2100,
                            sizeDp = 100.dp
                        )

                        Column {
                            Row(verticalAlignment = Alignment.Bottom) {
                                Text(
                                    text = "1,420",
                                    style = NourishTypography.displayLarge.copy(fontSize = 32.sp),
                                    fontWeight = FontWeight.ExtraBold,
                                    color = NourishForestGreen
                                )
                                Text(
                                    text = " / 2,100",
                                    style = NourishTypography.titleLarge,
                                    color = NourishTextSecondary,
                                    modifier = Modifier.padding(bottom = 4.dp, start = 4.dp)
                                )
                            }
                            Text(
                                text = "KILOCALORIES TARGET",
                                style = NourishTypography.labelSmall,
                                color = NourishTextSecondary,
                                letterSpacing = 1.sp
                            )
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp),
                                modifier = Modifier.padding(top = 4.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.TrendingUp,
                                    contentDescription = null,
                                    tint = NourishForestGreen,
                                    modifier = Modifier.size(16.dp)
                                )
                                Text(
                                    text = "On track for campus wellness",
                                    style = NourishTypography.bodySmall,
                                    fontWeight = FontWeight.Medium,
                                    color = NourishForestGreen
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // 3-Column Macro Breakdown Tiles
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(18.dp))
                            .background(NourishSurfaceContainerLow)
                            .padding(8.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        MacroProgressTile(
                            label = "Carbs",
                            currentGrams = 185,
                            targetGrams = 240,
                            icon = Icons.Default.Eco,
                            barColor = NourishForestGreen,
                            iconBgColor = NourishSoftMint,
                            iconTint = NourishForestGreen,
                            modifier = Modifier.weight(1f)
                        )
                        MacroProgressTile(
                            label = "Protein",
                            currentGrams = 72,
                            targetGrams = 110,
                            icon = Icons.Default.FitnessCenter,
                            barColor = NourishDeepPine,
                            iconBgColor = NourishMintFixed,
                            iconTint = NourishForestGreen,
                            modifier = Modifier.weight(1f)
                        )
                        MacroProgressTile(
                            label = "Fats",
                            currentGrams = 44,
                            targetGrams = 65,
                            icon = Icons.Default.Opacity,
                            barColor = NourishTextSecondary,
                            iconBgColor = NourishSurfaceContainerHigh,
                            iconTint = NourishTextSecondary,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // ==========================================
            // 3. TODAY'S MESS SCHEDULE SECTION
            // ==========================================
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
                        Text(
                            text = "Today's Mess Schedule",
                            style = NourishTypography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = NourishTextDark
                        )
                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(NourishSurfaceContainerHigh)
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "4 Meals",
                                style = NourishTypography.labelSmall,
                                color = NourishTextSecondary
                            )
                        }
                    }

                    TextButton(onClick = onNavigateToWeeklyMenu) {
                        Text(
                            text = "Full Week →",
                            style = NourishTypography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = NourishForestGreen
                        )
                    }
                }
            }

            // 1. Breakfast (Completed Card)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = NourishSurfaceWhite),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                        .background(NourishSoftMint),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = "Completed",
                                        tint = NourishForestGreen,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                                Column {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Text(
                                            text = "Breakfast",
                                            style = NourishTypography.titleMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = NourishTextDark
                                        )
                                        Box(
                                            modifier = Modifier
                                                .clip(CircleShape)
                                                .background(NourishSurfaceContainerLow)
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Text(
                                                text = "7:30 - 9:30 AM",
                                                style = NourishTypography.labelSmall.copy(fontSize = 10.sp),
                                                color = NourishTextSecondary
                                            )
                                        }
                                    }
                                    Text(
                                        text = "450 kcal consumed",
                                        style = NourishTypography.bodySmall,
                                        color = NourishTextSecondary
                                    )
                                }
                            }

                            Box(
                                modifier = Modifier
                                    .clip(CircleShape)
                                    .background(NourishSurfaceContainerLow)
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "Portioned: 100%",
                                    style = NourishTypography.labelSmall,
                                    color = NourishForestGreen,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "Idli (3 pcs) + Sambar + Peanut Chutney",
                            style = NourishTypography.bodyMedium,
                            fontWeight = FontWeight.Medium,
                            color = NourishTextOnSurfaceVariant,
                            modifier = Modifier.padding(start = 46.dp)
                        )
                    }
                }
            }

            // 2. Lunch (Active Live Now Highlight Dome Card)
            item {
                ArchCanopyHeroCard(
                    topArchRadius = 32.dp,
                    bottomRadius = 20.dp,
                    elevation = 4.dp
                ) {
                    // Live Banner
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(CircleShape)
                                    .background(NourishForestGreen)
                                    .padding(horizontal = 10.dp, vertical = 4.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(6.dp)
                                            .clip(CircleShape)
                                            .background(NourishMintFixed)
                                    )
                                    Text(
                                        text = "LIVE NOW",
                                        style = NourishTypography.labelSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                            }

                            Text(
                                text = "Lunch Session",
                                style = NourishTypography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = NourishTextDark
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(NourishSoftMint)
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "Rec: 680 kcal",
                                style = NourishTypography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = NourishForestGreen
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Optimal Choice Tag & Hours
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(NourishSurfaceContainerLow)
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Optimal Mess Choice",
                            style = NourishTypography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = NourishForestGreen
                        )
                        Text(
                            text = "12:30 PM - 2:30 PM",
                            style = NourishTypography.labelSmall,
                            color = NourishTextSecondary
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Steamed Rice (1.5 cup) • Dal Tadka (1 bowl) • Bhindi Masala (1 katori) • Curd (100g)",
                        style = NourishTypography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = NourishTextDark
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Smart Swap Advice
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(NourishSoftMint.copy(alpha = 0.5f))
                            .padding(10.dp),
                        verticalAlignment = Alignment.Top,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lightbulb,
                            contentDescription = null,
                            tint = NourishForestGreen,
                            modifier = Modifier.size(18.dp)
                        )
                        Column {
                            Text(
                                text = "Smart Plate Swap",
                                style = NourishTypography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = NourishForestGreen
                            )
                            Text(
                                text = "Swap 0.5 cup rice for extra Dal serving to gain +7g clean protein for afternoon labs.",
                                style = NourishTypography.bodySmall,
                                color = NourishTextOnSurfaceVariant
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    NourishPillButton(
                        text = "View Plate Details & Log",
                        icon = Icons.Default.Restaurant,
                        onClick = onNavigateToMealDetail
                    )
                }
            }

            // 3. Evening Snacks Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = NourishSurfaceWhite),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                NumberedMintBadge(number = 3)
                                Column {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Text(
                                            text = "Evening Snacks",
                                            style = NourishTypography.titleMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = NourishTextDark
                                        )
                                        Box(
                                            modifier = Modifier
                                                .clip(CircleShape)
                                                .background(NourishSurfaceContainerLow)
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Text(
                                                text = "5:00 - 6:00 PM",
                                                style = NourishTypography.labelSmall.copy(fontSize = 10.sp),
                                                color = NourishTextSecondary
                                            )
                                        }
                                    }
                                    Text(
                                        text = "Target: ~220 kcal",
                                        style = NourishTypography.bodySmall,
                                        color = NourishTextSecondary
                                    )
                                }
                            }

                            Box(
                                modifier = Modifier
                                    .clip(CircleShape)
                                    .background(NourishSurfaceContainerLow)
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "Upcoming",
                                    style = NourishTypography.labelSmall,
                                    color = NourishTextSecondary
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "Crispy Veg Puff / Samosa & Cutting Ginger Tea",
                            style = NourishTypography.bodyMedium,
                            fontWeight = FontWeight.Medium,
                            color = NourishTextOnSurfaceVariant,
                            modifier = Modifier.padding(start = 46.dp)
                        )
                    }
                }
            }

            // 4. Dinner Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = NourishSurfaceWhite),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                NumberedMintBadge(number = 4)
                                Column {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Text(
                                            text = "Dinner",
                                            style = NourishTypography.titleMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = NourishTextDark
                                        )
                                        Box(
                                            modifier = Modifier
                                                .clip(CircleShape)
                                                .background(NourishSurfaceContainerLow)
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Text(
                                                text = "7:30 - 9:30 PM",
                                                style = NourishTypography.labelSmall.copy(fontSize = 10.sp),
                                                color = NourishTextSecondary
                                            )
                                        }
                                    }
                                    Text(
                                        text = "Target: ~550 kcal",
                                        style = NourishTypography.bodySmall,
                                        color = NourishTextSecondary
                                    )
                                }
                            }

                            Box(
                                modifier = Modifier
                                    .clip(CircleShape)
                                    .background(NourishSurfaceContainerLow)
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = "Upcoming",
                                    style = NourishTypography.labelSmall,
                                    color = NourishTextSecondary
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "Phulka (3 pcs) + Paneer Butter Masala / Chicken Gravy + Fresh Green Salad",
                            style = NourishTypography.bodyMedium,
                            fontWeight = FontWeight.Medium,
                            color = NourishTextOnSurfaceVariant,
                            modifier = Modifier.padding(start = 46.dp)
                        )
                    }
                }
            }

            // ==========================================
            // 4. MESS HALL QUEUE DELIGHT CARD
            // ==========================================
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = NourishSurfaceContainerLow),
                    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .clip(CircleShape)
                                    .background(NourishSoftMint),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Groups,
                                    contentDescription = null,
                                    tint = NourishForestGreen,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                            Column {
                                Text(
                                    text = "Mess Hall Queue",
                                    style = NourishTypography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = NourishTextDark
                                )
                                Text(
                                    text = "Moderate rush (~4 mins wait at North Counter)",
                                    style = NourishTypography.bodySmall,
                                    color = NourishTextSecondary
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(NourishSoftMint)
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "Fast Moving",
                                style = NourishTypography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = NourishForestGreen
                            )
                        }
                    }
                }
            }
        }
    }
}
