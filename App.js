import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text } from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// Complete Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCEaylFdChEU-idKJjo5hF1L027hFIsdXk",
  authDomain: "internetshop-8bc07.firebaseapp.com",
  databaseURL: "https://internetshop-8bc07.firebaseio.com", // Added
  projectId: "internetshop-8bc07",
  storageBucket: "internetshop-8bc07.firebasestorage.app", // Corrected to .appspot.com
  messagingSenderId: "39838192060",
  appId: "1:39838192060:web:63fe6d61fa881474625bb9",
  measurementId: "G-PVRM21E6EV" // Optional, can be omitted
};

// Initialize Firebase at module level
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized:', firebase.apps);
} else {
  console.log('Firebase already initialized:', firebase.apps);
}

const Drawer = createDrawerNavigator();

const HomeScreen = () => {
  React.useEffect(() => {
    firestore()
      .collection('test')
      .get()
      .then(querySnapshot => {
        console.log('Firestore data:', querySnapshot.docs.map(doc => doc.data()));
      })
      .catch(error => console.error('Firestore error:', error));
  }, []);
  return <Text>Home Screen with Firebase</Text>;
};

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;



// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Text } from 'react-native';
// import firebase from '@react-native-firebase/app'; // Import Firebase app
// import firestore from '@react-native-firebase/firestore';

// // Initialize Firebase (optional if native config is correct, but ensures JS-side setup)
// if (!firebase.apps.length) {
//   firebase.initializeApp(); // Uses google-services.json/GoogleService-Info.plist automatically
// }

// const Drawer = createDrawerNavigator();

// const HomeScreen = () => {
//   React.useEffect(() => {
//     firestore()
//       .collection('test')
//       .get()
//       .then(querySnapshot => {
//         console.log('Firestore data:', querySnapshot.docs.map(doc => doc.data()));
//       })
//       .catch(error => console.error('Firestore error:', error));
//   }, []);
//   return <Text>Home Screen with Firebase</Text>;
// };

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator>
//         <Drawer.Screen name="Home" component={HomeScreen} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;



 // import React from 'react';
// import { Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import firestore from '@react-native-firebase/firestore';

// const Drawer = createDrawerNavigator();

// const HomeScreen = () => {
//   React.useEffect(() => {
//     firestore().collection('test').get().then(querySnapshot => {
//       console.log('Firestore data:', querySnapshot.docs.map(doc => doc.data()));
//     });
//   }, []);
//   return <Text>Home Screen with Firebase</Text>;
// };

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator>
//         <Drawer.Screen name="Home" component={HomeScreen} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { View, Text, StyleSheet } from 'react-native';

// const Drawer = createDrawerNavigator();

// const DashboardScreen = () => {
//   console.log('DashboardScreen rendered');
//   return (
//     <View style={styles.screen}>
//       <Text style={styles.text}>Dashboard Screen</Text>
//     </View>
//   );
// };

// const SettingsScreen = () => {
//   console.log('SettingsScreen rendered');
//   return (
//     <View style={styles.screen}>
//       <Text style={styles.text}>Settings Screen</Text>
//     </View>
//   );
// };

// const App = () => {
//   console.log('App rendered');
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator initialRouteName="Dashboard">
//         <Drawer.Screen name="Dashboard" component={DashboardScreen} />
//         <Drawer.Screen name="Settings" component={SettingsScreen} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

// export default App;







// import 'react-native-gesture-handler';
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const App = () => {
//   console.log('App rendered');
//   return (
//     <View style={styles.screen}>
//       <Text style={styles.text}>Hello World</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

// export default App;
//here






// import React from 'react';
// import { View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// // import { DashboardScreen } from './screens/DashboardScreen';
// // import { SettingsScreen } from './screens/SettingsScreen';


// const Drawer = createDrawerNavigator();


// const DashboardScreen = () => {
//   return(
//     <View>
//       <Text>DashboardScreen</Text>
//     </View>
//   )
// }

// const SettingsScreen = () => {
//   return (
//     <View>
//       <Text>SettingsScreen</Text>
//     </View>
//   )
// }

// const App = () => {

//   return (
//     <NavigationContainer>
//       <Drawer.Navigator>
//         <Drawer.Screen name='Dashboard' component={DashboardScreen}/>
//         <Drawer.Screen name='Settings' component={SettingsScreen}/>
//       </Drawer.Navigator>
//     </NavigationContainer>
//   )
// }






// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React from 'react';
// import type {Node} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// /* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
//  * LTI update could not be added via codemod */
// const Section = ({children, title}): Node => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

// const App: () => Node = () => {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.js</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;
