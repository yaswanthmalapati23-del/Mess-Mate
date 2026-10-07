package com.messmate.data.model

import kotlinx.serialization.Serializable

@Serializable
data class StudentAccount(
    val id: String, // auth.users UUID
    val email: String,
    val collegeDomain: String,
    val onboardingCompleted: Boolean = false,
    val name: String? = null,
    val hostelBlock: String? = null,
    val age: Int? = null,
    val gender: String? = null,
    val heightCm: Float? = null,
    val weightKg: Float? = null,
    val goal: String? = null,
    val targetCalories: Int? = null,
    val targetProteinG: Float? = null
)
