package com.volkermatthes.designkit

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/** A brand icon in one color; decorative unless it has a [contentDescription]. */
@Composable
fun BrandIconImage(
  icon: BrandIcon,
  modifier: Modifier = Modifier,
  size: Dp = 20.dp,
  tint: Color = LocalContentColor.current,
  contentDescription: String? = null,
) {
  Image(
    painter = painterResource(icon.res),
    contentDescription = contentDescription,
    modifier = modifier.size(size),
    colorFilter = ColorFilter.tint(tint),
  )
}

/** A duotone icon with its area solid in [fill] and the outline in [line]. */
@Composable
fun DuotoneIconImage(
  icon: DuotoneIcon,
  fill: Color,
  line: Color,
  modifier: Modifier = Modifier,
  size: Dp = 20.dp,
) {
  Box(modifier.size(size)) {
    Image(painterResource(icon.fill), null, Modifier.size(size), colorFilter = ColorFilter.tint(fill))
    Image(painterResource(icon.line), null, Modifier.size(size), colorFilter = ColorFilter.tint(line))
  }
}
