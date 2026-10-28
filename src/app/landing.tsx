import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Platform,
  useWindowDimensions,
  Linking,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { heroImage } from "@/images/hero.jpeg"
import { heroImg } from "@/images/hero.webp"


// import "hero.jpeg" from "@/images";
// --------------------------------------------


export default function LandingScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Navbar */}
      <View style={[styles.navbar, { paddingHorizontal: isDesktop ? 60 : 20 }]}>
        <View style={styles.brandContainer}>
          {/* <View style={styles.brandIconBox}>
            <Ionicons name="bag-check-outline" size={24} color="#FFFFFF" />
          </View> */}
          <Text style={styles.brandText}>Smart Shopper</Text>
          {/* <Text style={styles.brandText}>Sharp Shopper</Text> */}
        </View>

        <Pressable
          style={styles.navLaunchButton}
          onPress={() => router.replace("/" as any)}
        >
          {/* <Text style={styles.navLaunchButtonText}>Open App</Text> */}
          <Text style={styles.navLaunchButtonText}>Go To App</Text>

          <Ionicons
            name="arrow-forward"
            size={16}
            color="#FFFFFF"
            style={{ marginLeft: 6 }}
          />
        </Pressable>
      </View>

      {/* Hero Section */}
      <View
        style={[styles.heroSection, { paddingHorizontal: isDesktop ? 60 : 20 }]}
      >
        <View
          style={[styles.heroContent, isDesktop && styles.heroContentDesktop]}
        >
          {/* <View style={styles.pillBadge}>
            <Ionicons name="flash" size={14} color="#D97706" style={{ marginRight: 6 }} />
            <Text style={styles.pillBadgeText}>Smart Offline-First Shopping</Text>
          </View> */}

          <Text style={styles.heroTitle}>
            Organize Your Shopping.
            <br />
            <Text style={styles.heroTitleHighlight}>Without Limits.</Text>
          </Text>

          <Text style={styles.heroDescription}>
            Create multiple smart shopping lists, snap product photos on the go,
            <br />
            track estimated prices, and check off items seamlessly whether
            you're online or offline.
          </Text>

          {/* <Text style={styles.heroDescription}>
            Create multiple smart shopping lists, snap product photos on the go, track estimated prices, and check off items seamlessly whether you're online or offline.
          </Text> */}

          {/* <Text style={styles.heroDescription}>
            Create multiple smart shopping lists, snap product photos on the go, 
          </Text>

   <Text style={styles.heroDescription}>
           track estimated prices, and check off items seamlessly whether you're online or offline.
          </Text> */}


          <View style={styles.heroButtonsRow}>
          

            <Pressable
              style={ [ styles.navLaunchButton, 
                { padding: 18, borderRadius: 15,  }
              ]}
              onPress={() => router.replace("/" as any)}
            >
              <Ionicons
                name="globe-outline"
                size={18}
                color="#ffffff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.navLaunchButtonText}>Use the Web App</Text>

            </Pressable>
          </View>
<br />

          <View style={styles.heroButtonsRow}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.replace("/" as any)}
            >
              <Ionicons
                name="rocket-outline"
                size={18}
                color="#2e2d01"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.primaryButtonText}>Download the Mobile App</Text>

            </Pressable>
          </View>
          <br />

          <View style={styles.heroButtonsRow}>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => Linking.openURL("https://github.com")}
            >
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#1F2937"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.secondaryButtonText}>
                Download the Source Code
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Hero Illustration / App Preview Mockup */}
        <View
          style={[
            styles.heroImageContainer,
            isDesktop && styles.heroImageContainerDesktop,
          ]}
        >
          <Image
            // source={ heroImage }
            // source={ heroImg }

            source={{
              uri: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=1195&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Features Grid Section */}
      <View
        style={[
          styles.featuresSection,
          { paddingHorizontal: isDesktop ? 60 : 20 },
        ]}
      >
        {/* <Text style={styles.sectionCategory}>POWERFUL FEATURES</Text> */}
        <Text style={styles.sectionTitle}>
          Everything you need to shop smarter
        </Text>

        <View
          style={[styles.featuresGrid, isDesktop && styles.featuresGridDesktop]}
        >
          {/* Feature 1 */}
          <View style={styles.featureCard}>
            {/* <View style={[styles.featureIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="cloud-offline-outline" size={24} color="#D97706" />
            </View> */}
            <Text style={styles.featureCardTitle}>Offline-First Storage</Text>
            <Text style={styles.featureCardDesc}>
              Powered by local device persistence. Your lists and items are
              always saved securely, even without an internet connection.
            </Text>
          </View>

          {/* Feature 2 */}
          <View style={styles.featureCard}>
            {/* <View style={[styles.featureIconBox, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="camera-outline" size={24} color="#4F46E5" />
            </View> */}
            <Text style={styles.featureCardTitle}>
              Camera & Gallery Uploads
            </Text>
            <Text style={styles.featureCardDesc}>
              Snap live photos of products using your camera or pick references
              straight from your gallery to keep visual tabs on items.
            </Text>
          </View>

          {/* Feature 3 */}
          <View style={styles.featureCard}>
            {/* <View style={[styles.featureIconBox, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="search-outline" size={24} color="#059669" />
            </View> */}
            <Text style={styles.featureCardTitle}>
              Real-Time Item Filtering
            </Text>
            <Text style={styles.featureCardDesc}>
              Quickly look up products or categories inside your active lists
              using the lightning-fast instant search bar.
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2026 Smart Shopper Built with React Native & Expo.
        </Text>
      </View>
    </ScrollView>
  );
}

const color1 = "#1aaa00";
// backgroundColor: '#95f376',

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },

  // --- NAVBAR
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#95f376",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1aaa00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  brandText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  navLaunchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navLaunchButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  // --- Hero
  heroSection: {
    paddingVertical: 50,
    flexDirection: "column",
    minHeight: 500,
  },

  // -- left
  heroContent: {
    alignItems: "flex-start",
    marginBottom: 40,
    marginTop: 60,
  },
  heroContentDesktop: {
    maxWidth: "55%",
    paddingRight: 20,
  },

  // -- right
  heroImageContainer: {
    width: "100%",
    // height: 280,
    // minHeight: 300,

    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  heroImageContainerDesktop: {
    position: "absolute",
    right: 60,
    top: 50,
    width: "40%",
    height: 420,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  pillBadgeText: {
    color: "#D97706",
    fontWeight: "700",
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 46,
    marginBottom: 16,
  },
  heroTitleHighlight: {
    color: "#1aaa00",
  },
  heroDescription: {
    fontSize: 16,
    // color: '#4B5563',
    color: "#457644",

    lineHeight: 24,
    marginBottom: 24,
  },
  heroButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: '#1aaa00',
    backgroundColor: "#95f376",

    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    // color: '#FFFFFF',
    color: "#393101",

    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryButtonText: {
    color: "#1F2937",
    fontWeight: "700",
    fontSize: 15,
  },

  // --- feature section
  featuresSection: {
    minHeight: 300,
    paddingVertical: 50,
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  sectionCategory: {
    fontSize: 12,
    fontWeight: "800",
    color: "#E59400",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 30,
  },
  featuresGrid: {
    flexDirection: "column",
    gap: 20,
  },
  featuresGridDesktop: {
    flexDirection: "row",
    gap: 20,
  },
  featureCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  featureCardDesc: {
    fontSize: 14,
    // color: '#6B7280',
    // color: '#5c8955',
    color: "#457644",

    lineHeight: 20,
  },

  // --- footer
  footer: {
    paddingVertical: 30,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  footerText: {
    fontSize: 13,
    // color: '#9CA3AF',
    color: "#5c8955",
  },
});
