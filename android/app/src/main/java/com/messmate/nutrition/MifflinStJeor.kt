package com.messmate.nutrition

import kotlin.math.max
import kotlin.math.roundToInt

enum class GoalType { LOSE, MAINTAIN, GAIN, FITNESS }
enum class ActivityLevel(val multiplier: Float) {
    SEDENTARY(1.2f),
    LIGHTLY_ACTIVE(1.375f),
    MODERATELY_ACTIVE(1.55f),
    VERY_ACTIVE(1.725f),
    EXTRA_ACTIVE(1.9f)
}

data class ProfileInput(
    val name: String,
    val hostelBlock: String,
    val age: Int,
    val gender: String, // "male" or "female"
    val heightCm: Float,
    val weightKg: Float,
    val activityLevel: ActivityLevel,
    val goal: GoalType,
    val dietPreference: String, // "veg", "egg", "non-veg"
    val allergies: List<String>,
    val hasMedicalCondition: Boolean
)

data class CalculatedNutritionTargets(
    val bmr: Int,
    val tdee: Int,
    val targetCalories: Int,
    val targetProteinG: Int,
    val targetCarbsG: Int,
    val targetFatG: Int,
    val bmi: Float,
    val isExtremeBmi: Boolean,
    val calorieFloorTriggered: Boolean,
    val isLiabilityGuardrailActive: Boolean
)

object MifflinStJeor {
    fun calculate(input: ProfileInput): CalculatedNutritionTargets {
        // 1. BMI
        val heightM = input.heightCm / 100f
        val bmi = (input.weightKg / (heightM * heightM) * 10).roundToInt() / 10f
        val isExtremeBmi = bmi < 16.5f || bmi > 35.0f

        // 2. BMR (Mifflin-St Jeor)
        var bmr = 10f * input.weightKg + 6.25f * input.heightCm - 5f * input.age
        bmr += if (input.gender.equals("male", ignoreCase = true)) 5f else -161f
        val bmrInt = bmr.roundToInt()

        // 3. TDEE
        val tdee = (bmrInt * input.activityLevel.multiplier).roundToInt()

        // 4. Clinical Guardrails
        var targetCalories = tdee
        var targetProteinG = (input.weightKg * 1.4f).roundToInt()
        var calorieFloorTriggered = false
        val isLiabilityGuardrailActive = input.hasMedicalCondition || isExtremeBmi

        if (isLiabilityGuardrailActive) {
            // General balanced guidance mode
            targetCalories = tdee
            targetProteinG = (input.weightKg * 1.2f).roundToInt()
        } else {
            when (input.goal) {
                GoalType.LOSE -> {
                    targetCalories = tdee - 450
                    targetProteinG = (input.weightKg * 1.8f).roundToInt()
                }
                GoalType.GAIN -> {
                    targetCalories = tdee + 400
                    targetProteinG = (input.weightKg * 1.9f).roundToInt()
                }
                GoalType.FITNESS -> {
                    targetCalories = tdee - 150
                    targetProteinG = (input.weightKg * 2.0f).roundToInt()
                }
                GoalType.MAINTAIN -> {
                    targetCalories = tdee
                    targetProteinG = (input.weightKg * 1.4f).roundToInt()
                }
            }
        }

        // Hard Calorie Floor Guardrail (Non-negotiable)
        val safeFloor = if (input.gender.equals("male", ignoreCase = true)) 1400 else 1200
        if (targetCalories < safeFloor) {
            targetCalories = safeFloor
            calorieFloorTriggered = true
        }

        val proteinCalories = targetProteinG * 4
        val fatCalories = (targetCalories * 0.25f).roundToInt()
        val targetFatG = max(30, fatCalories / 9)
        val carbCalories = max(0, targetCalories - (proteinCalories + targetFatG * 9))
        val targetCarbsG = carbCalories / 4

        return CalculatedNutritionTargets(
            bmr = bmrInt,
            tdee = tdee,
            targetCalories = targetCalories,
            targetProteinG = targetProteinG,
            targetCarbsG = targetCarbsG,
            targetFatG = targetFatG,
            bmi = bmi,
            isExtremeBmi = isExtremeBmi,
            calorieFloorTriggered = calorieFloorTriggered,
            isLiabilityGuardrailActive = isLiabilityGuardrailActive
        )
    }
}
