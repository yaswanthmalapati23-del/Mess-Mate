package com.messmate.data.model

import kotlinx.serialization.Serializable

@Serializable
data class FoodCourtShop(
    val id: String,
    val name: String,
    val tagline: String,
    val icon: String,
    val priceRange: String,
    val popularItemName: String,
    val fitMatchCount: Int = 0
)

@Serializable
data class FoodCourtItem(
    val id: String,
    val shopId: String,
    val shopName: String,
    val name: String,
    val price: Double,
    val category: String, // "veg", "non-veg", "egg"
    val calories: Int,
    val protein: Float,
    val carbs: Float,
    val fat: Float,
    val fiber: Float,
    val allergens: List<String> = emptyList(),
    val portionDescription: String,
    val isPopular: Boolean = false,
    val isBestValue: Boolean = false,
    val proteinPerRupee: Float = 0f
) {
    val proteinPerRupeeFormatted: String
        get() = String.format("%.3fg/₹", protein / price.coerceAtLeast(1.0))
}
