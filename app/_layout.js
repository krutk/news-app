import { Stack } from "expo-router";
import { Drawer } from "../components/Drawer";
import { StyleSheet } from "react-native";
export default function Layout() {
  return (<Drawer screenOptions={{drawerActiveTintColor: "#124559",
  drawerInactiveTintColor: "gray",
  drawerLabelStyle: styles.drawerLabel,
  drawerContentContainerStyle: styles.drawerContentContainer,
  headerStatusBarHeight: 32
  }}>
    <Drawer.Screen
      name="index" // This is the name of the page and must match the url from root
      options={{
        drawerLabel: "News",
        title: "News",
      }}
    />
    <Drawer.Screen
      name="submit-news/index" // This is the name of the page and must match the url from root
      options={{
        drawerLabel: "Submit News",
        title: "Submit News",
      }}
    />
  </Drawer>)
}

const styles = StyleSheet.create({
  drawerLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  drawerContentContainer: {
    paddingVertical: 16,
  },
});

// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { Drawer } from "../components/Drawer";

// export default function Layout() {
//   return (
//     <Drawer
//       screenOptions={{
//         drawerActiveTintColor: "#124559",
//         drawerInactiveTintColor: "gray",
//         drawerLabelStyle: styles.drawerLabel,
//         drawerContentContainerStyle: styles.drawerContentContainer,
//       }}
//     >
//       <Drawer.Screen
//         name="index"
//         options={{
//           drawerLabel: "News",
//           title: "Desi Hip Hop News",
//         }}
//         // component={HomeScreen}
//       />
//       <Drawer.Screen
//         name="submit-news/index"
//         options={{
//           drawerLabel: "Submit News",
//           title: "Submit News",
//         }}
//       />
//     </Drawer>
//   );
// }

// const styles = StyleSheet.create({
//   drawerLabel: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   drawerContentContainer: {
//     paddingVertical: 16,
//   },
// });
