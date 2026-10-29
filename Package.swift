// swift-tools-version: 6.0
import PackageDescription

// Design for the iOS apps (letmeshowyou, Rudel): tokens, fonts, shadows and
// glass, and the icons of @volkermatthes/icons. Tokens.generated.swift and
// Accents.generated.swift come from packages/design, the icon imagesets from
// packages/icons (`pnpm generate`).
let package = Package(
  name: "DesignKit",
  platforms: [.iOS(.v18)],
  products: [
    .library(name: "DesignKit", targets: ["DesignKit"]),
  ],
  targets: [
    .target(
      name: "DesignKit",
      path: "packages/DesignKit/Sources/DesignKit",
      resources: [.process("Resources")]
    ),
  ]
)
