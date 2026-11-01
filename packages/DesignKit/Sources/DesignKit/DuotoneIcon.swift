import SwiftUI

/// Duotone icons of @volkermatthes/icons, split into two template layers so
/// each can take its own color: `fill` is the duotone's soft area (15 %
/// opacity on the web), `line` the outline. A new icon: add a case;
/// `pnpm generate` writes both imagesets from packages/icons/src/svgs.
public enum DuotoneIcon: String, CaseIterable, Sendable {
  case book = "BookDuotone"
  case calendar = "CalendarDuotone"
  case carrot = "CarrotDuotone"
  case cart = "CartDuotone"
  case checklist = "ClipboardFilledDuotone"
  case heart = "HeartDuotone"
  case home = "HomeDuotone"
  case people = "PeopleDuotone"
  case shoppingBag = "ShoppingBagDuotone"
  case star = "StarDuotone"

  /// The soft area as a template image.
  public var fill: Image {
    Image("\(rawValue)Fill", bundle: .module).renderingMode(.template)
  }

  /// The outline as a template image.
  public var line: Image {
    Image("\(rawValue)Line", bundle: .module).renderingMode(.template)
  }
}

/// A duotone icon with its area filled solid in `fill` and the outline in
/// `line`, e.g. a list's icon in the list's accent color.
public struct DuotoneIconImage: View {
  let icon: DuotoneIcon
  var size: CGFloat
  var fill: Color
  var line: Color

  public init(icon: DuotoneIcon, size: CGFloat = 20, fill: Color, line: Color) {
    self.icon = icon
    self.size = size
    self.fill = fill
    self.line = line
  }

  public var body: some View {
    ZStack {
      icon.fill.resizable().scaledToFit().foregroundStyle(fill)
      icon.line.resizable().scaledToFit().foregroundStyle(line)
    }
    .frame(width: size, height: size)
  }
}
