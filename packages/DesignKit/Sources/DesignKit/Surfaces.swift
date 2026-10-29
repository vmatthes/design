import SwiftUI

extension View {
  /// Soft card shadow (`--shadow-card`).
  public func cardShadow() -> some View {
    modifier(CardShadow())
  }

  /// Floating elements: buttons over content, sheets (`--shadow-float`).
  public func floatShadow() -> some View {
    modifier(FloatShadow())
  }

  /// Floating bars over content (input, media player): Liquid Glass on
  /// iOS 26, a material with a hairline and shadow before.
  public func liquidGlass<S: InsettableShape>(in shape: S) -> some View {
    modifier(LiquidGlass(shape: shape))
  }
}

/// Fill for round buttons on a glass surface, like the secondary buttons in
/// the Claude app: a light tint of the text color instead of a solid token.
public enum GlassFill {
  public static let button = Tokens.foreground.opacity(0.08)
}

private struct LiquidGlass<S: InsettableShape>: ViewModifier {
  let shape: S

  func body(content: Content) -> some View {
    if #available(iOS 26, *) {
      // Plain glass lets bright covers shine through and text gets hard to
      // read; a card-colored fill under the content keeps it legible, the
      // glass still shapes the edge.
      content
        .background(Tokens.card.opacity(0.82), in: shape)
        .glassEffect(.regular, in: shape)
    } else {
      content
        .background {
          shape
            .fill(.regularMaterial)
            .overlay(shape.strokeBorder(Tokens.foreground.opacity(0.08), lineWidth: 1))
            .floatShadow()
        }
    }
  }
}

private struct CardShadow: ViewModifier {
  @Environment(\.colorScheme) private var scheme

  func body(content: Content) -> some View {
    content
      .shadow(color: .black.opacity(scheme == .dark ? 0.3 : 0.04), radius: 1, y: 1)
      .shadow(color: .black.opacity(scheme == .dark ? 0.25 : 0.04), radius: 10, y: 6)
  }
}

private struct FloatShadow: ViewModifier {
  @Environment(\.colorScheme) private var scheme

  func body(content: Content) -> some View {
    content.shadow(color: .black.opacity(scheme == .dark ? 0.5 : 0.12), radius: 15, y: 8)
  }
}
