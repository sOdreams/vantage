# ADR 0001: Stay compatible with Expo Go

Date: 2026-10-07
Status: accepted

## Context

Development happens on Linux with an iPhone and no paid Apple Developer account.
Without a Mac or the $99/year program there is no way to install a custom iOS
build (a "development build") on the phone. The only way to run the app on the
iPhone is the Expo Go app from the App Store, which currently supports Expo SDK 57.

## Decision

- Pin Expo SDK 57 until the App Store version of Expo Go moves to SDK 58.
- Only use libraries that ship inside Expo Go. No custom native modules.
- Styling: React Native `StyleSheet`/inline styles driven by `@vantage/tokens`
  (no Unistyles, which needs native code).
- Storage: AsyncStorage instead of MMKV.
- Map (Day 6): MapLibre GL JS inside `react-native-webview`, instead of
  `@maplibre/maplibre-react-native`, which is not in Expo Go.

## Consequences

- Zero cost to develop and test on a real iPhone.
- The map runs in a web view: fine for tens of markers, less smooth than native
  for very large datasets. Revisit if the app moves to paid distribution, where
  development builds become possible and the native map module can replace it.
- When Expo Go updates to a new SDK, the app must be upgraded within a few weeks
  (`npx expo install expo@^58 --fix`).
