import SwiftUI

/// Icons of @volkermatthes/icons (Filled variants), as template images in
/// this package's asset catalog. A new icon: copy its SVG from
/// packages/icons/src/svgs as an imageset into Resources/Icons.xcassets/Icons
/// and add a case.
public enum BrandIcon: String, CaseIterable, Sendable {
  case grid = "GridFilled"
  case board = "BoardFilled"
  case folder = "FolderFilled"
  case book = "BookFilled"
  case star = "StarFilled"
  case heart = "HeartFilled"
  case lightbulb = "LightbulbFilled"
  case photos = "PhotosFilled"
  case pin = "PinFilled"
  /// Pinning blocks (PinFilled-1 in @volkermatthes/icons); `pin` is the
  /// collection icon.
  case pushpin = "PushpinFilled"
  case link = "LinkFilled"
  case home = "HomeFilled"
  case inbox = "InboxFilled"
  case person = "PersonFilled"
  case pot = "PotFilled"
  case calendar = "CalendarFilled"
  case calendarDots = "CalendarDotsFilled"
  case calendarNumber = "CalendarNumberFilled"
  case bag = "ShoppingBagFilled"
  case camera = "CameraFilled"
  case cart = "CartFilled"
  case cross = "CrossFilled"
  case exclamation = "CircleExclamationFilled"
  case info = "CircleInfoFilled"
  case question = "CircleQuestionFilled"
  case clipboard = "ClipboardFilled"
  case clock = "ClockFilled"
  case cloud = "CloudFilled"
  case download = "DownloadFilled"
  case comment = "CommentFilled"
  case share = "ShareFilled"
  case controller = "ControllerFilled"
  case creditcard = "CreditcardFilled"
  case delivery = "DeliveryFilled"
  case globe = "GlobeFilled"
  case github = "GithubFilled"
  case happy = "HappyFilled"
  case headphones = "HeadphonesFilled"
  case tag = "PricetagFilled"
  case lock = "LockFilled"
  case microphone = "MicrophoneFilled"
  case thumbUp = "ThumbUpFilled"
  case thumbDown = "ThumbDownFilled"
  case plus = "Plus"
  case settings = "SettingsFilled"
  case trash = "TrashFilled"
  case note = "DocumentFilledFilled"
  case document = "DocumentFilled"
  case image = "ImageFilled"
  case imagePlus = "ImagePlusFilled"
  case indent = "ArrowRightFilled"
  case outdent = "ArrowLeftFilled"
  case video = "PlayFilled"
  case audio = "MusicFilled"
  case checkmark = "CheckmarkFilled"
  case chevronLeft = "ChevronLeftFilled"
  case chevronUpDown = "ChevronUpDownFilled"
  case more = "DotsHorizontalFilled"
  case heading = "Heading"
  case heading1 = "Headline1Filled"
  case heading2 = "Headline2Filled"
  case heading3 = "Headline3Filled"
  case paragraph = "ParagraphFilled"
  case list = "ListFilled"
  case bulletList = "BulletListFilled"
  case numberedList = "NumberedListFilled"
  case checklist = "CircleCheckFilled"
  case checklistBlock = "ChecklistFilled"
  case divider = "MinusFilled"
  case dividerBlock = "DividerFilled"
  case code = "CodeFilled"
  case codeBlock = "CodeblockFilled"
  case edit = "EditFilled"
  case apple = "AppleFilled"
  case building = "BuildingFilled"
  case carrot = "CarrotFilled"
  case meat = "MeatFilled"
  case monitor = "MonitorFilled"
  case people = "PeopleFilled"
  case graph = "GraphFilled"
  case sun = "SunFilled"
  case moon = "MoonFilled"
  case giftTag = "TagFilled"
  case eye = "EyeFilled"
  case eyeOff = "EyeOffFilled"
  case duplicate = "DuplicateFilled"
  case external = "ExternalFilled"
  case personPlus = "PersonPlusFilled"
  case pause = "PauseFilled"
  case roadmap = "RoadmapDuotone"
  case searchDuotone = "SearchDuotone"
  case plusFilled = "PlusFilled"
  case chevronRight = "ChevronRightFilled"
  case arrowUp = "ArrowUpFilled"
  case spotify = "SpotifyFilled"
  case move = "FolderOpenFilled"
  case google = "GoogleMark"
  case next = "NextFilled"
  case previous = "PreviousFilled"
  case maximize = "MaximizeFilled"
  case minimize = "MinimizeFilled"
  case search = "SearchFilled"
  case repeating = "RepeatFilled"
  case bell = "NotificationFilled"
  case chevronDown = "ChevronDownFilled"
  case telephone = "TelephoneFilled"
  case email = "EmailFilled"

  public var assetName: String {
    switch self {
    case .heading: return BrandIcon.heading2.rawValue
    default: return rawValue
    }
  }


  /// The icon as a template image, tinted by the foreground style.
  public var image: Image {
    Image(assetName, bundle: .module).renderingMode(.template)
  }
}

public struct BrandIconImage: View {
  let icon: BrandIcon
  var size: CGFloat

  public init(icon: BrandIcon, size: CGFloat = 20) {
    self.icon = icon
    self.size = size
  }

  public var body: some View {
    icon.image
      .resizable()
      .scaledToFit()
      .frame(width: size, height: size)
  }
}

extension Label where Title == Text, Icon == Image {
  /// A label with a brand icon, e.g. in menus.
  public init(_ title: some StringProtocol, icon: BrandIcon) {
    self.init { Text(title) } icon: { icon.image }
  }
}
