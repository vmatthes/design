package com.volkermatthes.designkit

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

/** Inter for text, Bricolage Grotesque ExtraBold for titles. */
object AppFont {
  enum class Weight(internal val value: FontWeight) {
    Regular(FontWeight.Normal),
    Medium(FontWeight.Medium),
    Semibold(FontWeight.SemiBold),
    Bold(FontWeight.Bold),
  }

  val inter = FontFamily(
    Font(R.font.inter_regular, FontWeight.Normal),
    Font(R.font.inter_medium, FontWeight.Medium),
    Font(R.font.inter_semibold, FontWeight.SemiBold),
    Font(R.font.inter_bold, FontWeight.Bold),
  )

  val display = FontFamily(Font(R.font.bricolage_extrabold, FontWeight.ExtraBold))

  /** Inter in one of its weights; sizes scale with the system font size. */
  fun app(size: Float, weight: Weight = Weight.Regular): TextStyle =
    TextStyle(fontFamily = inter, fontWeight = weight.value, fontSize = size.sp)

  /** Titles in Bricolage track slightly tighter, like the web (-2.2 %). */
  fun display(size: Float): TextStyle =
    TextStyle(
      fontFamily = display,
      fontWeight = FontWeight.ExtraBold,
      fontSize = size.sp,
      letterSpacing = (-0.022).em,
    )
}
