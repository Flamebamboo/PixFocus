const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...resolver,
  assetExts: [...resolver.assetExts.filter((ext) => ext !== "svg"), "onnx", "bin", "json"],
  sourceExts: [...resolver.sourceExts, "svg"],
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
};

module.exports = wrapWithReanimatedMetroConfig(withNativeWind(config, { input: "./global.css" }));
