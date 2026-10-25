// svgr template: every icon shares IconProps and forwards remaining props to <svg>.
module.exports = ({ componentName, jsx, exports }, { tpl }) => tpl`
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
