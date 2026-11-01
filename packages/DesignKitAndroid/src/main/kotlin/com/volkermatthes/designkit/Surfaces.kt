package com.volkermatthes.designkit

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.dropShadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.shadow.Shadow
import androidx.compose.ui.unit.DpOffset
import androidx.compose.ui.unit.dp

/** Soft card shadow (`--shadow-card`). */
@Composable
fun Modifier.cardShadow(shape: Shape): Modifier {
  val dark = LocalDarkTheme.current
  return dropShadow(shape, Shadow(2.dp, Color.Black.copy(alpha = if (dark) 0.3f else 0.04f), offset = DpOffset(0.dp, 1.dp)))
    .dropShadow(shape, Shadow(20.dp, Color.Black.copy(alpha = if (dark) 0.25f else 0.04f), offset = DpOffset(0.dp, 6.dp)))
}

/** Floating elements: buttons over content, sheets (`--shadow-float`). */
@Composable
fun Modifier.floatShadow(shape: Shape): Modifier {
  val dark = LocalDarkTheme.current
  return dropShadow(shape, Shadow(30.dp, Color.Black.copy(alpha = if (dark) 0.5f else 0.12f), offset = DpOffset(0.dp, 8.dp)))
}
