// Same icons for React Native: react-native-svg components in src/native/generated.
module.exports = {
  ...require("./.svgrrc.js"),
  native: true,
  template: require("./src/native/template.js"),
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: { overrides: { removeViewBox: false } },
      },
      // react-native-svg has no xmlns prop.
      "removeXMLNS",
      { name: "removeAttrs", params: { attrs: "class" } },
    ],
  },
}
