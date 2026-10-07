package com.messmate.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Sparkles
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.messmate.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun AuthScreen(
    onAuthSuccess: (email: String, isNewStudent: Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    var step by remember { mutableStateOf("email") } // "email" or "otp"
    var email by remember { mutableStateOf("") }
    var otpDigits by remember { mutableStateOf(List(6) { "" }) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    var resendCooldown by remember { mutableIntStateOf(0) }

    val focusRequesters = remember { List(6) { FocusRequester() } }

    // 30s cooldown countdown
    LaunchedEffect(resendCooldown) {
        if (resendCooldown > 0) {
            delay(1000L)
            resendCooldown -= 1
        }
    }

    // Client-side domain validation: must end in @vitap.ac.in or @student.vitap.ac.in
    val cleanEmail = email.trim().lowercase()
    val isDomainValid = cleanEmail.contains("@") && (
        cleanEmail.endsWith("@vitapstudent.ac.in") || cleanEmail.endsWith("@vitap.ac.in")
    )
    val hasAtSymbol = cleanEmail.contains("@")

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(ObsidianBase)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = ObsidianCard),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, ObsidianBorder, RoundedCornerShape(28.dp))
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Top Brand Icon
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(RoundedCornerShape(18.dp))
                        .background(TerracottaPrimary),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "🍲", fontSize = 28.sp)
                }

                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Mess Mate",
                    color = TextWhite,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    fontFamily = FontFamily.Serif
                )
                Text(
                    text = "Campus Nutrition • Student Verification",
                    color = TextMuted,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Error Banner
                if (errorMessage != null) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0x33DC2626),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0x66DC2626)),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp)
                    ) {
                        Text(
                            text = errorMessage ?: "",
                            color = Color(0xFFFCA5A5),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(12.dp),
                            lineHeight = 15.sp
                        )
                    }
                }

                if (step == "email") {
                    // SCREEN 1: COLLEGE EMAIL ENTRY
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.School,
                                    contentDescription = null,
                                    tint = SaffronPrimary,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "COLLEGE EMAIL",
                                    color = TextMuted,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.sp
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Color(0x33C85A32),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0x66C85A32))
                            ) {
                                Text(
                                    text = "@vitapstudent.ac.in",
                                    color = TerracottaLight,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        OutlinedTextField(
                            value = email,
                            onValueChange = {
                                email = it
                                errorMessage = null
                            },
                            placeholder = { Text("e.g. 21bce1001@vitapstudent.ac.in", color = TextMuted, fontSize = 13.sp) },
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(
                                keyboardType = KeyboardType.Email,
                                imeAction = ImeAction.Done
                            ),
                            keyboardActions = KeyboardActions(onDone = {
                                if (isDomainValid) {
                                    step = "otp"
                                    resendCooldown = 30
                                }
                            }),
                            shape = RoundedCornerShape(16.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = TerracottaPrimary,
                                unfocusedBorderColor = ObsidianBorder,
                                focusedTextColor = TextWhite,
                                unfocusedTextColor = TextWhite,
                                focusedContainerColor = ObsidianSurface,
                                unfocusedContainerColor = ObsidianSurface
                            ),
                            modifier = Modifier.fillMaxWidth()
                        )

                        if (hasAtSymbol && !isDomainValid) {
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "⚠️ Only college emails ending with @vitapstudent.ac.in are allowed.",
                                color = Color(0xFFFCA5A5),
                                fontSize = 11.sp
                            )
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        Button(
                            onClick = {
                                if (!isDomainValid) {
                                    errorMessage = "Registration is restricted to college students (@vitapstudent.ac.in)."
                                    return@Button
                                }
                                isLoading = true
                                errorMessage = null
                                // Simulated or Supabase signInWithOtp trigger
                                step = "otp"
                                resendCooldown = 30
                                isLoading = false
                            },
                            enabled = isDomainValid && !isLoading,
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = TerracottaPrimary),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp)
                        ) {
                            Text(text = "Send 6-Digit Code", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.width(6.dp))
                            Icon(imageVector = Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                        }
                    }
                } else {
                    // SCREEN 2: 6-DIGIT OTP ENTRY
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.clickable {
                                    step = "email"
                                    errorMessage = null
                                }
                            ) {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                    contentDescription = "Back",
                                    tint = TextMuted,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(text = "Edit email", color = TextMuted, fontSize = 11.sp)
                            }
                            Text(text = "STEP 2 OF 2", color = SaffronLight, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(text = "Enter 6-Digit Code", color = TextWhite, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        Text(text = "Sent to $cleanEmail", color = TerracottaLight, fontSize = 11.sp)

                        Spacer(modifier = Modifier.height(18.dp))

                        // 6 Digit Boxes
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            otpDigits.forEachIndexed { index, digit ->
                                Box(
                                    modifier = Modifier
                                        .size(42.dp)
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(ObsidianSurface)
                                        .border(1.dp, if (digit.isNotEmpty()) TerracottaPrimary else ObsidianBorder, RoundedCornerShape(10.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    BasicTextField(
                                        value = digit,
                                        onValueChange = { newVal ->
                                            if (newVal.length <= 1) {
                                                val updated = otpDigits.toMutableList()
                                                updated[index] = newVal
                                                otpDigits = updated
                                                if (newVal.isNotEmpty() && index < 5) {
                                                    focusRequesters[index + 1].requestFocus()
                                                }
                                                if (updated.all { it.isNotEmpty() }) {
                                                    onAuthSuccess(cleanEmail, true)
                                                }
                                            }
                                        },
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                        modifier = Modifier.focusRequester(focusRequesters[index]),
                                        textStyle = androidx.compose.ui.text.TextStyle(
                                            color = TextWhite,
                                            fontSize = 18.sp,
                                            fontWeight = FontWeight.Bold,
                                            textAlign = TextAlign.Center
                                        )
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        Button(
                            onClick = {
                                if (otpDigits.any { it.isEmpty() }) {
                                    errorMessage = "Please enter all 6 digits."
                                    return@Button
                                }
                                onAuthSuccess(cleanEmail, true)
                            },
                            enabled = otpDigits.all { it.isNotEmpty() },
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = TerracottaPrimary),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp)
                        ) {
                            Icon(imageVector = Icons.Default.Sparkles, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Verify & Enter", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        if (resendCooldown > 0) {
                            Text(
                                text = "Resend code in ${resendCooldown}s",
                                color = TextMuted,
                                fontSize = 11.sp
                            )
                        } else {
                            Text(
                                text = "Didn't receive code? Resend",
                                color = TerracottaLight,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.clickable {
                                    resendCooldown = 30
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
