// _layout.styles.ts  //

import { StyleSheet } from "react-native";

export const stylesLayout = StyleSheet.create({
  // === TOP NAVBAR ===
  mobileTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1aaa00", 
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 100,
  },

  topBarDefaultContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // --- contents of top navbar ---
  brandSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 14,
  },
  brandMain: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    paddingBottom: 10,
    paddingTop: 20, 

  },
  topBarIconsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  searchBarActiveContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D97706",
  },
});
