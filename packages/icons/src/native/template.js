// svgr template for React Native: same IconProps API, rendered with react-native-svg.
module.exports = ({ componentName, imports, jsx, exports }, { tpl }) => tpl`
${imports};
import type { IconProps } from "../types";

const ${componentName} = ({
  size = 16,
  width = size,
  height = size,
  color = "currentColor",
  ...props
}: IconProps) => (
  ${jsx}
);

${exports};
`
