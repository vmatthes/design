// Generated from packages/design/src/tokens.ts – do not edit.
package com.volkermatthes.designkit

import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.ui.graphics.Color

/**
 * Design tokens, the same values as the CSS variables of the web apps.
 * Each color follows the theme set by [DesignTheme].
 */
object Tokens {
  val background: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFF2F1EC, 0xFF141413)
  val foreground: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF1A1A1A, 0xFFEDECE7)
  val card: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFFFFFFF, 0xFF1F1F1D)
  val cardForeground: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF1A1A1A, 0xFFEDECE7)
  val popover: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFFFFFFF, 0xFF252523)
  val popoverForeground: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF1A1A1A, 0xFFEDECE7)
  val primary: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF1A1A1A, 0xFFEDECE7)
  val primaryForeground: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFFFFFFF, 0xFF141413)
  val secondary: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFFFFFFF, 0xFF1F1F1D)
  val secondaryForeground: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF1A1A1A, 0xFFEDECE7)
  val muted: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFF2F1EC, 0xFF2A2A27)
  val mutedForeground: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF5E5E58, 0xFFA8A7A0)
  val accent: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFE8E6DF, 0xFF363632)
  val accentForeground: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF1A1A1A, 0xFFEDECE7)
  val destructive: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFB42318, 0xFFF97066)
  val destructiveSoft: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFFBEDE9, 0xFF3A1D1A)
  val border: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFEEEDE8, 0xFF2C2C29)
  val input: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFE2E0D8, 0xFF3A3A36)
  val ring: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF1A1A1A, 0xFFEDECE7)
  /** Text shades, all ≥ 4.5:1 on the ground and on cards. */
  val inkSoft: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF3A3A36, 0xFFD6D5CF)
  val inkMuted: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF4F4F4A, 0xFFC2C1BA)
  val sunken: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFE8E6DF, 0xFF2A2A27)
  val placeholder: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF8E8D89, 0xFF85847E)
  /** Inverted cards: dark on light, light on dark. */
  val inkCard: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF1A1A1A, 0xFFEDECE7)
  val inkCardForeground: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFFFFFFF, 0xFF1A1A1A)
  val inkCardMuted: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFBDBDB6, 0xFF5E5E58)
  val inkCardSoft: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFD6D6D0, 0xFF3A3A36)
  val inkCardChip: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF333330, 0xFFDCDAD3)
  val inkCardChipHover: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF444440, 0xFFCFCDC5)
  /** Text on accent colors stays ink in both themes. */
  val onAccent: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF1A1A1A, 0xFF1A1A1A)
  /** Drop line while dragging, and selected items. */
  val drop: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF2F80ED, 0xFF5AA0F2)
  /** Sheet grabbers. */
  val grabber: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFC9C7C0, 0xFF4A4A45)
  /** Dashed outlines of add buttons. */
  val dashed: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFCFCDC5, 0xFF4A4A45)
  /** The circle around today in the calendar. */
  val calendarToday: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFE5484D, 0xFFE5484D)
  val inlineGray: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF787774, 0xFF9B9B9B)
  val inlineBrown: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF9F6B53, 0xFFBA856F)
  val inlineOrange: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFD9730D, 0xFFC77D48)
  val inlineYellow: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFCB912F, 0xFFCA9849)
  val inlineGreen: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF448361, 0xFF529E72)
  val inlineBlue: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF337EA9, 0xFF5E87C9)
  val inlinePurple: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFF9065B0, 0xFF9D68D3)
  val inlinePink: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFC14C8A, 0xFFD15796)
  val inlineRed: Color
    @Composable @ReadOnlyComposable get() = dynamicColor(0xFFD44C47, 0xFFDF5452)
}
