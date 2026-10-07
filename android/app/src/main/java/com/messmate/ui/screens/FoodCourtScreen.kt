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
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Storefront
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
import com.messmate.data.model.FoodCourtItem
import com.messmate.data.model.FoodCourtShop
import com.messmate.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FoodCourtScreen(
    onNavigateBack: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var selectedShopId by remember { mutableStateOf<String?>(null) }
    val loggedItemIds = remember { mutableStateListOf<String>() }

    // Campus vendor shops
    val shops = remember {
        listOf(
            FoodCourtShop(
                id = "shop_rolls_nation",
                name = "Rolls Nation / Kathi Junction",
                tagline = "High-protein campus kathi rolls & tawa wraps",
                icon = "🌯",
                priceRange = "₹60–140",
                popularItemName = "Double Egg Chicken Roll",
                fitMatchCount = 3
            ),
            FoodCourtShop(
                id = "shop_annapurna",
                name = "Annapurna South Indian",
                tagline = "Fermented dosas, idlis, and hot sambar",
                icon = "🥞",
                priceRange = "₹35–80",
                popularItemName = "Ghee Podi Masala Dosa",
                fitMatchCount = 2
            ),
            FoodCourtShop(
                id = "shop_punjab_express",
                name = "Punjab Express / Tandoor Hub",
                tagline = "Tandoori rotis, paneer curries & grilled chicken",
                icon = "🥘",
                priceRange = "₹70–160",
                popularItemName = "Paneer Tikka with Tandoori Roti",
                fitMatchCount = 4
            ),
            FoodCourtShop(
                id = "shop_juice_corner",
                name = "Campus Fresh Juice & Shake Bar",
                tagline = "Cold-pressed juices, coconut water & protein shakes",
                icon = "🥤",
                priceRange = "₹40–90",
                popularItemName = "Banana Peanut Butter Shake",
                fitMatchCount = 2
            )
        )
    }

    // Closed-set campus food court items with campus pricing
    val allItems = remember {
        listOf(
            FoodCourtItem(
                id = "fc_egg_roll",
                shopId = "shop_rolls_nation",
                shopName = "Rolls Nation / Kathi Junction",
                name = "Double Egg Chicken Kathi Roll",
                price = 90.0,
                category = "non-veg",
                calories = 460,
                protein = 23.0f,
                carbs = 42.0f,
                fat = 20.0f,
                fiber = 2.5f,
                portionDescription = "1 standard wrapped roll (~220g)",
                isPopular = true,
                isBestValue = true,
                proteinPerRupee = 0.255f
            ),
            FoodCourtItem(
                id = "fc_paneer_roll",
                shopId = "shop_rolls_nation",
                shopName = "Rolls Nation / Kathi Junction",
                name = "Tandoori Paneer Roll",
                price = 85.0,
                category = "veg",
                calories = 420,
                protein = 16.5f,
                carbs = 44.0f,
                fat = 18.0f,
                fiber = 3.0f,
                portionDescription = "1 wrapped roll (~200g)",
                isPopular = false,
                isBestValue = false,
                proteinPerRupee = 0.194f
            ),
            FoodCourtItem(
                id = "fc_soya_roll",
                shopId = "shop_rolls_nation",
                shopName = "Rolls Nation / Kathi Junction",
                name = "Spicy Soya Chaap Roll",
                price = 70.0,
                category = "veg",
                calories = 380,
                protein = 21.0f,
                carbs = 46.0f,
                fat = 12.0f,
                fiber = 4.5f,
                portionDescription = "1 wrapped roll (~190g)",
                isPopular = false,
                isBestValue = false,
                proteinPerRupee = 0.300f
            ),
            FoodCourtItem(
                id = "fc_masala_dosa",
                shopId = "shop_annapurna",
                shopName = "Annapurna South Indian",
                name = "Masala Dosa with Sambar & Chutney",
                price = 60.0,
                category = "veg",
                calories = 340,
                protein = 7.2f,
                carbs = 54.0f,
                fat = 10.5f,
                fiber = 3.8f,
                portionDescription = "1 large crisp dosa + 150ml sambar",
                isPopular = true,
                isBestValue = false,
                proteinPerRupee = 0.120f
            ),
            FoodCourtItem(
                id = "fc_idli_sambar",
                shopId = "shop_annapurna",
                shopName = "Annapurna South Indian",
                name = "Steamed Idli Sambar (Set of 2)",
                price = 45.0,
                category = "veg",
                calories = 210,
                protein = 8.4f,
                carbs = 42.0f,
                fat = 1.2f,
                fiber = 4.0f,
                portionDescription = "2 medium idlis + 150ml sambar",
                isPopular = false,
                isBestValue = true,
                proteinPerRupee = 0.187f
            ),
            FoodCourtItem(
                id = "fc_paneer_tikka",
                shopId = "shop_punjab_express",
                shopName = "Punjab Express / Tandoor Hub",
                name = "Tandoori Paneer Tikka (6 pcs)",
                price = 120.0,
                category = "veg",
                calories = 360,
                protein = 24.0f,
                carbs = 12.0f,
                fat = 22.0f,
                fiber = 2.0f,
                portionDescription = "6 skewered paneer cubes + onion & mint dip",
                isPopular = true,
                isBestValue = false,
                proteinPerRupee = 0.200f
            ),
            FoodCourtItem(
                id = "fc_grilled_chicken",
                shopId = "shop_punjab_express",
                shopName = "Punjab Express / Tandoor Hub",
                name = "Half Tandoori Chicken",
                price = 140.0,
                category = "non-veg",
                calories = 420,
                protein = 46.0f,
                carbs = 4.0f,
                fat = 14.0f,
                fiber = 0.0f,
                portionDescription = "Half bird (~320g bone-in)",
                isPopular = true,
                isBestValue = true,
                proteinPerRupee = 0.328f
            ),
            FoodCourtItem(
                id = "fc_banana_shake",
                shopId = "shop_juice_corner",
                shopName = "Campus Fresh Juice & Shake Bar",
                name = "Banana Peanut Butter Shake (No Added Sugar)",
                price = 70.0,
                category = "veg",
                calories = 310,
                protein = 13.5f,
                carbs = 42.0f,
                fat = 9.0f,
                fiber = 3.5f,
                portionDescription = "1 tall glass (350ml)",
                isPopular = true,
                isBestValue = true,
                proteinPerRupee = 0.193f
            )
        )
    }

    val selectedShop = shops.find { it.id == selectedShopId }
    val filteredItems = allItems.filter { it.shopId == selectedShopId }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(ObsidianBase)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item { Spacer(modifier = Modifier.height(4.dp)) }

        // Step 1 or Step 2 Header
        item {
            if (selectedShop != null) {
                // Step 2 Header: Shop Scoped with Back Button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = { selectedShopId = null },
                        colors = IconButtonDefaults.iconButtonColors(containerColor = ObsidianSurface)
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back to shops",
                            tint = TextWhite
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = selectedShop.icon, fontSize = 18.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = selectedShop.name,
                                color = TextWhite,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                fontFamily = FontFamily.Serif
                            )
                        }
                        Text(
                            text = "${selectedShop.priceRange} • ${selectedShop.tagline}",
                            color = TextMuted,
                            fontSize = 11.sp
                        )
                    }
                }
            } else {
                // Step 1 Header: Campus Vendors Directory
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "CAMPUS FOOD COURT",
                                color = TextMuted,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "Choose a Vendor",
                                color = TextWhite,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Black,
                                fontFamily = FontFamily.Serif
                            )
                        }

                        Surface(
                            shape = CircleShape,
                            color = TerracottaSurface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0x66C85A32))
                        ) {
                            Text(
                                text = "${shops.size} SHOPS",
                                color = TerracottaLight,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Pick a shop to browse smart recommendations with student pricing and protein-per-₹ value.",
                        color = TextMuted,
                        fontSize = 12.sp,
                        lineHeight = 16.sp
                    )
                }
            }
        }

        // STEP 1: SHOP CARDS LIST
        if (selectedShop == null) {
            items(shops) { shop ->
                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = ObsidianCard),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, ObsidianBorder, RoundedCornerShape(20.dp))
                        .clickable { selectedShopId = shop.id }
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.weight(1f)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(44.dp)
                                        .background(Color(0x1AFFFFFF), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(text = shop.icon, fontSize = 22.sp)
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = shop.name,
                                        color = TextWhite,
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = shop.tagline,
                                        color = TextMuted,
                                        fontSize = 11.sp,
                                        lineHeight = 15.sp
                                    )
                                }
                            }

                            // Price Range Badge
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Color(0x1FFFFFFF),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0x33FFFFFF))
                            ) {
                                Text(
                                    text = shop.priceRange,
                                    color = TextWhite,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 7.dp, vertical = 3.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        HorizontalDivider(color = ObsidianBorder, thickness = 1.dp)
                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Popular: ${shop.popularItemName}",
                                color = TextMuted,
                                fontSize = 11.sp,
                                modifier = Modifier.weight(1f)
                            )

                            // Fit Badge
                            Surface(
                                shape = CircleShape,
                                color = OliveSurface,
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0x664A5D4E))
                            ) {
                                Text(
                                    text = "🎯 ${shop.fitMatchCount} fit goal",
                                    color = OliveLight,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }
                }
            }
        } else {
            // STEP 2: SCOPED SHOP ITEM LIST
            items(filteredItems) { item ->
                val isLogged = loggedItemIds.contains(item.id)

                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = ObsidianCard),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            1.dp,
                            if (item.isBestValue) Color(0x66E09F3E) else ObsidianBorder,
                            RoundedCornerShape(18.dp)
                        )
                ) {
                    Column {
                        if (item.isBestValue) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0x33E09F3E))
                                    .padding(horizontal = 12.dp, vertical = 4.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "⚡ BEST VALUE (${item.proteinPerRupeeFormatted})",
                                        color = SaffronLight,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Black
                                    )
                                    Text(
                                        text = "Top Protein-Per-₹ Ratio",
                                        color = SaffronLight,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
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
                                }

                                Spacer(modifier = Modifier.height(3.dp))
                                Text(
                                    text = item.portionDescription,
                                    color = TextMuted,
                                    fontSize = 11.sp
                                )

                                Spacer(modifier = Modifier.height(6.dp))

                                // Macros & Price Line
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Text(
                                        text = "${item.calories} kcal",
                                        color = TextWhite,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(text = "•", color = TextMuted, fontSize = 10.sp)
                                    Text(
                                        text = "${item.protein}g protein",
                                        color = SaffronLight,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(text = "•", color = TextMuted, fontSize = 10.sp)
                                    Text(
                                        text = "₹${item.price.toInt()}",
                                        color = OliveLight,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Black
                                    )
                                }
                            }

                            // Log Action Button
                            Column(
                                horizontalAlignment = Alignment.End,
                                modifier = Modifier.padding(start = 8.dp)
                            ) {
                                if (isLogged) {
                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = OliveSurface,
                                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0x664A5D4E))
                                    ) {
                                        Text(
                                            text = "✓ Logged",
                                            color = OliveLight,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp)
                                        )
                                    }
                                } else {
                                    Button(
                                        onClick = { loggedItemIds.add(item.id) },
                                        colors = ButtonDefaults.buttonColors(containerColor = TerracottaPrimary),
                                        shape = RoundedCornerShape(10.dp),
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                        modifier = Modifier.height(32.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Add,
                                            contentDescription = null,
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(text = "Log", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(24.dp)) }
    }
}
