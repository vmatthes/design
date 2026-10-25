module.exports = {
  typescript: true,
  icon: true,
  jsxRuntime: "automatic",
  template: require("./src/template.js"),
  replaceAttrValues: { "#000": "{color}" },
  svgProps: {
    width: "{width}",
    height: "{height}",
  },
  expandProps: "end",
}
