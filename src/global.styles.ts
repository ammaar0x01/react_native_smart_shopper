/*
global.styles.ts 
================
*/

import { TextStyle, ViewStyle } from "react-native";
import { ThemeDefault } from "./themeDefault.styles";
// -----------------------------------

// --- Change the theme here --- 
export const themeName = ThemeDefault

// --- SETUP ---
const backgroundColor = themeName.background
const textColor = themeName.text
const pageHeadingColor = themeName.pageHeading 
const pageSubheadingColor = themeName.pageSubheading 
// --------------------------------------


export const GlobalStyles = {
  // === PAGE LAYOUT ===
  mainContainer: {
    flex: 1,
    backgroundColor: backgroundColor, 
    textColor: textColor, 
    padding: 40,
    paddingBottom: 0,
    paddingTop: 0,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 40,
  },
  contentWrapper: {
    width: "100%",
    alignSelf: "center",
  },
  contentWrapperDesktop: {
    maxWidth: 700,
  },

  // === HEADER ===
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 10,

  } as ViewStyle,

  pageHeading: {
    fontSize: 44,
    // fontWeight: '600', 
    fontWeight: "600" as TextStyle["fontWeight"],
    color: pageHeadingColor, 
    marginBottom: 5,
    letterSpacing: -1, 

    // fontSize: 34,
    // fontWeight: 'bold',
    // color: '#1a1a1a',
  },
  pageSubheading: {
    fontSize: 13,
    color: pageSubheadingColor, 
    // marginTop: 4,
    marginBottom: 20, 
  } as const,
};
