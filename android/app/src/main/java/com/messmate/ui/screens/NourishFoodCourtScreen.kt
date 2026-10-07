package com.messmate.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
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

data class CanteenFoodItem(
    val id: String,
    val name: String,
    val outlet: String,
    val location: String,
    val price: Int,
    val calories: Int,
    val protein: Int,
    val isVeg: Boolean,
    val tag: String? = null,
    val category: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NourishFoodCourtScreen(
    onNavigateBack: () -> Unit = {},
    onAddToCart: (CanteenFoodItem) -> Unit = {}
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All Outlets") }

    val categories = listOf(
        "All Outlets",
        "Under 300 kcal",
        "High Protein (>20g)",
        "Fresh Juices",
        "South Kiosk",
        "Rolls & Wraps"
    )

    val foodItems = remember {
        listOf(
            CanteenFoodItem(
                id = "1",
                name = "Paneer Tikka Roll",
                outlet = "Hot 'n' Roll",
                location = "Rock Plaza",
                price = 90,
                calories = 380,
                protein = 18,
                isVeg = true,
                tag = "Fast Pick",
                category = "Rolls & Wraps"
            ),
            CanteenFoodItem(
                id = "2",
                name = "Grilled Chicken Breast Plate",
                outlet = "FitGrill",
                location = "SAC Outlets",
                price = 160,
                calories = 420,
                protein = 38,
                isVeg = false,
                tag = "Athlete Special",
                category = "High Protein (>20g)"
            ),
            CanteenFoodItem(
                id = "3",
                name = "Fresh Cold-Pressed Watermelon",
                outlet = "Juice Oasis",
                location = "Rock Plaza",
                price = 50,
                calories = 110,
                protein = 2,
                isVeg = true,
                tag = "No Sugar Added",
                category = "Fresh Juices"
            ),
            CanteenFoodItem(
                id = "4",
                name = "Steamed Chicken Momos (6 pcs)",
                outlet = "Himalayan Corner",
                location = "SAC Outlets",
                price = 110,
                calories = 260,
                protein = 22,
                isVeg = false,
                tag = "High Protein",
                category = "Under 300 kcal"
            ),
            CanteenFoodItem(
                id = "5",
                name = "Ghee Podi Thatte Idli (2 pcs)",
                outlet = "Dakshin Delights",
                location = "Rock Plaza",
                price = 70,
                calories = 290,
                protein = 8,
                isVeg = true,
                tag = "South Authentic",
                category = "South Kiosk"
            )
        )
    }

    val filteredItems = foodItems.filter { item ->
        val matchesSearch = item.name.contains(searchQuery, ignoreCase = true) ||
                item.outlet.contains(searchQuery, ignoreCase = true)
        val matchesCategory = when (selectedCategory) {
            "All Outlets" -> true
            "Under 300 kcal" -> item.calories < 300
            "High Protein (>20g)" -> item.protein >= 20
            else -> item.category == selectedCategory
        }
        matchesSearch && matchesCategory
    }

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
                                text = "Explore",
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
            // Hero Campus Dining Active Arch Banner
            item {
                ArchCanopyHeroCard(
                    backgroundColor = NourishSurfaceContainerLow,
                    topArchRadius = 40.dp,
                    bottomRadius = 24.dp
                ) {
                    Row(
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
                            text = "CAMPUS DINING ACTIVE NOW",
                            style = NourishTypography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = NourishTextSecondary,
                            letterSpacing = 1.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Food Court & Canteen",
                        style = NourishTypography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = NourishTextDark
                    )

                    Text(
                        text = "Rock Plaza & Student Activity Center (SAC) Outlets",
                        style = NourishTypography.bodySmall,
                        color = NourishTextSecondary
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Eco,
                                contentDescription = null,
                                tint = NourishForestGreen,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "Clean Ingredients & Nutri-Tracking",
                                style = NourishTypography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = NourishForestGreen
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(NourishSurfaceWhite)
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "12 Open",
                                style = NourishTypography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = NourishTextSecondary
                            )
                        }
                    }
                }
            }

            // Search Bar Component
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = CircleShape,
                    color = NourishSurfaceWhite,
                    shadowElevation = 1.dp
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = NourishForestGreen,
                            modifier = Modifier.size(22.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        TextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            placeholder = {
                                Text(
                                    text = "Search shawarma, dosa, juice, wraps...",
                                    style = NourishTypography.bodyMedium,
                                    color = NourishTextSecondary
                                )
                            },
                            singleLine = true,
                            colors = TextFieldDefaults.colors(
                                focusedContainerColor = Color.Transparent,
                                unfocusedContainerColor = Color.Transparent,
                                focusedIndicatorColor = Color.Transparent,
                                unfocusedIndicatorColor = Color.Transparent
                            ),
                            modifier = Modifier.weight(1f)
                        )
                        IconButton(
                            onClick = {},
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(NourishSoftMint.copy(alpha = 0.5f))
                        ) {
                            Icon(
                                imageVector = Icons.Default.Tune,
                                contentDescription = "Filter",
                                tint = NourishForestGreen,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
            }

            // Horizontal Category Chips
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    categories.forEach { category ->
                        NourishChip(
                            text = category,
                            isSelected = selectedCategory == category,
                            onClick = { selectedCategory = category }
                        )
                    }
                }
            }

            // Featured Intake Highlight Pill
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = NourishSurfaceContainerLow),
                    elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 14.dp, vertical = 10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clip(CircleShape)
                                    .background(NourishSoftMint),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "🔥", fontSize = 14.sp)
                            }
                            Text(
                                text = "Target Intake: 650 kcal left today",
                                style = NourishTypography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = NourishTextDark
                            )
                        }

                        Text(
                            text = "Track Live",
                            style = NourishTypography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = NourishForestGreen
                        )
                    }
                }
            }

            // Vendor Items Feed
            items(filteredItems, key = { it.id }) { item ->
                FoodCourtItemCard(
                    name = item.name,
                    outlet = item.outlet,
                    location = item.location,
                    price = item.price,
                    calories = item.calories,
                    protein = item.protein,
                    isVeg = item.isVeg,
                    tag = item.tag,
                    onAddClick = { onAddToCart(item) }
                )
            }
        }
    }
}
