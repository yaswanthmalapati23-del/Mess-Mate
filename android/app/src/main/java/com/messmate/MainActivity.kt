package com.messmate

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.messmate.ui.screens.NourishFoodCourtScreen
import com.messmate.ui.screens.NourishHomeScreen
import com.messmate.ui.screens.NourishMealDetailScreen
import com.messmate.ui.theme.NourishLightColorScheme
import com.messmate.ui.theme.NourishTypography

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = NourishLightColorScheme,
                typography = NourishTypography
            ) {
                MessMateAppNavigation()
            }
        }
    }
}

@Composable
fun MessMateAppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        composable("home") {
            NourishHomeScreen(
                onNavigateToMealDetail = { navController.navigate("meal_detail") },
                onNavigateToFoodCourt = { navController.navigate("food_court") }
            )
        }
        composable("meal_detail") {
            NourishMealDetailScreen(
                onBackClick = { navController.popBackStack() },
                onLogMealSuccess = { navController.popBackStack() }
            )
        }
        composable("food_court") {
            NourishFoodCourtScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}
