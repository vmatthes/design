import SwiftUI

/// A sticker motif: ink outline, white details, the rest in `color`. `dieCut`
/// cuts it out along the shape, with a white edge that follows the motif.
public struct StickerImage: View {
  let sticker: Sticker
  var color: Color
  var size: CGFloat
  var dieCut: Bool

  public init(
    _ sticker: Sticker,
    color: Color,
    size: CGFloat = 40,
    dieCut: Bool = false
  ) {
    self.sticker = sticker
    self.color = color
    self.size = size
    self.dieCut = dieCut
  }

  public var body: some View {
    let scale = size / StickerLayer.viewBox
    Canvas { context, _ in
      context.scaleBy(x: scale, y: scale)
      context.translateBy(x: 4, y: 4)
      let layers = StickerLayer.all[sticker] ?? []
      if dieCut {
        for layer in layers {
          let edge = StrokeStyle(
            lineWidth: layer.width + 2 * StickerLayer.dieCutEdge,
            lineCap: .round,
            lineJoin: .round
          )
          context.stroke(layer.path, with: .color(.white), style: edge)
          if layer.fill != .none {
            context.fill(layer.path, with: .color(.white))
          }
        }
      }
      for layer in layers {
        if let fill = layer.fill.color(accent: color) {
          context.fill(layer.path, with: .color(fill))
        }
        if let stroke = layer.stroke.color(accent: color) {
          context.stroke(
            layer.path,
            with: .color(stroke),
            style: StrokeStyle(
              lineWidth: layer.width,
              lineCap: .round,
              lineJoin: .round,
              dash: layer.dash
            )
          )
        }
      }
    }
    .frame(width: size, height: size)
    .shadow(
      color: dieCut ? .black.opacity(0.18) : .clear,
      radius: 2 * scale,
      y: 2.2 * scale
    )
    .accessibilityHidden(true)
  }
}

struct StickerLayer: Sendable {
  enum Paint: Sendable {
    case none, accent, white, ink, dim

    init(_ code: Substring) {
      switch code {
      case "c": self = .accent
      case "w": self = .white
      case "i": self = .ink
      case "d": self = .dim
      default: self = .none
      }
    }

    /// Ink and white stay the same in both themes, like the printed sticker.
    func color(accent: Color) -> Color? {
      switch self {
      case .none: nil
      case .accent: accent
      case .white: .white
      case .ink: Color(red: 0x1A / 255, green: 0x1A / 255, blue: 0x1A / 255)
      case .dim: Color(red: 0x4A / 255, green: 0x4A / 255, blue: 0x46 / 255)
      }
    }
  }

  static let viewBox: CGFloat = 72
  static let dieCutEdge: CGFloat = 3.4

  let fill: Paint
  let stroke: Paint
  let width: CGFloat
  let dash: [CGFloat]
  let path: Path

  /// Parsed once; the generated source is compact text.
  static let all: [Sticker: [StickerLayer]] = Dictionary(
    uniqueKeysWithValues: Sticker.allCases.map { sticker in
      (sticker, sticker.source.split(separator: "\n").map(StickerLayer.init))
    }
  )

  init(_ line: Substring) {
    let parts = line.split(separator: "|", omittingEmptySubsequences: false)
    fill = Paint(parts[0])
    stroke = Paint(parts[1])
    width = CGFloat(Double(parts[2]) ?? 0)
    dash = parts[3].split(separator: " ").compactMap { Double($0).map { CGFloat($0) } }
    path = Self.parse(parts[4])
  }

  /// Reads the absolute M, L, Q, C and Z commands the generator writes.
  private static func parse(_ data: Substring) -> Path {
    var path = Path()
    let tokens = data.split(separator: " ")
    var index = 0
    func point() -> CGPoint {
      let x = Double(tokens[index]) ?? 0
      let y = Double(tokens[index + 1]) ?? 0
      index += 2
      return CGPoint(x: x, y: y)
    }
    while index < tokens.count {
      let command = tokens[index]
      index += 1
      switch command {
      case "M":
        path.move(to: point())
      case "L":
        path.addLine(to: point())
      case "Q":
        let control = point()
        path.addQuadCurve(to: point(), control: control)
      case "C":
        let first = point()
        let second = point()
        path.addCurve(to: point(), control1: first, control2: second)
      default:
        path.closeSubpath()
      }
    }
    return path
  }
}
