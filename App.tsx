/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import messaging from "@react-native-firebase/messaging";
import auth from "@react-native-firebase/auth";
import React, { useEffect } from "react";

import type { PropsWithChildren } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

import RNInsider from "react-native-insider";
import InsiderCallbackType from "react-native-insider/src/InsiderCallbackType";
import InsiderGender from "react-native-insider/src/InsiderGender";
import ContentOptimizerDataType from "react-native-insider/src/ContentOptimizerDataType";
import RNInsiderIdentifier from "react-native-insider/src/InsiderIdentifier";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }

  getToken();
}

const getToken = async () => {
  const newToken = await messaging().getToken();
  if (newToken) {
    console.log("Token:" + newToken);
  } else {
    return newToken;
  }
};

async function initInsider() {
  console.log("Insider initialized");

  RNInsider.init(
    "your_partner_name",
    "group.com.useinsider.FireBaseAndInsider",
    (type, data) => {
      switch (type) {
        case InsiderCallbackType.NOTIFICATION_OPEN:
          console.log("[INSIDER][NOTIFICATION_OPEN]: ", data);
          Alert.alert("[INSIDER][NOTIFICATION_OPEN]:", JSON.stringify(data));
          break;
        case InsiderCallbackType.TEMP_STORE_CUSTOM_ACTION:
          console.log("[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ", data);
          Alert.alert(
            "[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ",
            JSON.stringify(data)
          );
          break;
      }
    }
  );

  RNInsider.registerWithQuietPermission(false);
  RNInsider.setActiveForegroundPushView();
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  requestUserPermission();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // console.log("A new FCM message arrived! :" + JSON.stringify(remoteMessage));
    });

    initInsider();

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
