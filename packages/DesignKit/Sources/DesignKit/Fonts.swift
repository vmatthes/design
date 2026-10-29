import CoreText
import SwiftUI
import UIKit

/// Inter for text, Bricolage Grotesque ExtraBold for titles (`font-display`
/// on the web). Sizes scale with Dynamic Type.
public enum AppFont {
  public enum Weight: Sendable {
    case regular, medium, semibold, bold

    public var name: String {
      switch self {
      case .regular: return "Inter-Regular"
      case .medium: return "Inter-Medium"
      case .semibold: return "Inter-SemiBold"
      case .bold: return "Inter-Bold"
      }
    }
  }

  public static let displayName = "BricolageGrotesque-ExtraBold"

  /// Registers the fonts shipped in this package with the process. Apps and
  /// extensions call it once at launch, before the first text renders; later
  /// calls do nothing.
  public static func register() {
    _ = registered
  }

  private static let registered: Void = {
    let urls = Bundle.module.urls(forResourcesWithExtension: "ttf", subdirectory: nil) ?? []
    for url in urls {
      CTFontManagerRegisterFontsForURL(url as CFURL, .process, nil)
    }
  }()

  public static func ui(_ size: CGFloat, _ weight: Weight = .regular, relativeTo style: UIFont.TextStyle = .body) -> UIFont {
    register()
    let font = UIFont(name: weight.name, size: size) ?? .systemFont(ofSize: size)
    return UIFontMetrics(forTextStyle: style).scaledFont(for: font)
  }

  public static func uiDisplay(_ size: CGFloat, relativeTo style: UIFont.TextStyle = .title1) -> UIFont {
    register()
    let font = UIFont(name: displayName, size: size) ?? .systemFont(ofSize: size, weight: .heavy)
    return UIFontMetrics(forTextStyle: style).scaledFont(for: font)
  }
}

extension Font {
  /// Inter in one of its weights.
  public static func app(_ size: CGFloat, _ weight: AppFont.Weight = .regular, relativeTo style: Font.TextStyle = .body) -> Font {
    .custom(weight.name, size: size, relativeTo: style)
  }

  /// Bricolage Grotesque ExtraBold for titles.
  public static func display(_ size: CGFloat, relativeTo style: Font.TextStyle = .title) -> Font {
    .custom(AppFont.displayName, size: size, relativeTo: style)
  }
}

extension View {
  /// Titles in Bricolage track slightly tighter, like the web (-2.2 %).
  public func displayTracking(_ size: CGFloat) -> some View {
    tracking(-size * 0.022)
  }
}
