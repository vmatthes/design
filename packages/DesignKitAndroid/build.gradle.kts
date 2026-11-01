// Design for the Android apps: tokens, fonts, shadows and icons. Apps include
// this folder as a module of their own build; plugin versions come from there.
// Tokens, enums, drawables and fonts are generated (`pnpm generate`).
plugins {
  id("com.android.library")
  id("org.jetbrains.kotlin.plugin.compose")
}

android {
  namespace = "com.volkermatthes.designkit"
  compileSdk = 37
  defaultConfig { minSdk = 26 }
}

dependencies {
  api(platform("androidx.compose:compose-bom:2026.09.00"))
  api("androidx.compose.material3:material3")
  api("androidx.compose.ui:ui")
  api("androidx.compose.foundation:foundation")
}
