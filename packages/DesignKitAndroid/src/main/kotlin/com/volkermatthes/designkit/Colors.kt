package com.volkermatthes.designkit

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.ui.graphics.Color

/** Whether [Tokens] resolve to their dark values. */
val LocalDarkTheme = compositionLocalOf { false }

/** Sets the theme for [Tokens] and the shadows below it. */
@Composable
fun DesignTheme(dark: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
  CompositionLocalProvider(LocalDarkTheme provides dark, content = content)
}

@Composable
@ReadOnlyComposable
internal fun dynamicColor(light: Long, dark: Long): Color =
  Color(if (LocalDarkTheme.current) dark else light)
