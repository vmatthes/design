import SwiftUI
import UIKit

extension Tokens {
  static func dynamic(_ light: UInt32, _ dark: UInt32) -> Color {
    Color(uiColor: uiDynamic(light, dark))
  }

  /// A UIKit color that follows the light or dark appearance.
  public static func uiDynamic(_ light: UInt32, _ dark: UInt32) -> UIColor {
    UIColor { traits in
      UIColor(hex: traits.userInterfaceStyle == .dark ? dark : light)
    }
  }

  /// The brand's first accent, for unread badges.
  public static let unread = Color(uiColor: UIColor(hex: 0xF7C548))
}

extension UIColor {
  public convenience init(hex: UInt32, alpha: CGFloat = 1) {
    self.init(
      red: CGFloat((hex >> 16) & 0xFF) / 255,
      green: CGFloat((hex >> 8) & 0xFF) / 255,
      blue: CGFloat(hex & 0xFF) / 255,
      alpha: alpha
    )
  }
}
