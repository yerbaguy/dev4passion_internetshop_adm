import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
// import { getFirestore } from 'firebase/firestore';

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

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

// const db = getFirestore(firebaseConfig)


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={MainScreen} options={{ title: 'Main' }} />
    {/* <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Add Product' }} /> */}
  </Stack.Navigator>
);

const ProductStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Products' }} />
    <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Add Product' }} />
  </Stack.Navigator>
);

const CategoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
    <Stack.Screen name="AddCategory" component={AddCategoryScreen} options={{ title: 'Add Category/Subcategory' }} />
  </Stack.Navigator>
);

const MainScreen = () => {
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
}


const ProductListScreen = () => {
  return (
    <View><Text>ProductListScreen</Text></View>
  )
}

// const AddProductScreen = () => {
//   return (
//     <View><Text>AddProductScreen</Text></View>
//   )
// }

const AddProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const addProduct = async () => {
    if (!name || !price || !selectedCategory) return;

    try {
      let imageUrl = '';
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `products/${Date.now()}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        categoryId: selectedCategory,
        imageUrl,
        createdAt: new Date().toISOString()
      });

      // Reset form
      setName('');
      setPrice('');
      setImage(null);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const renderCategory = ({ item, level = 0 }) => {
    const subCategories = categories.filter(cat => cat.parentId === item.id);

    return (
      <View style={{ marginLeft: level * 20 }}>
        <TouchableOpacity
          onPress={() => setSelectedCategory(item.id)}
          style={{ padding: 10 }}
        >
          <Text style={{ color: selectedCategory === item.id ? 'blue' : 'black' }}>
            {item.name}
          </Text>
        </TouchableOpacity>
        {subCategories.map(subCat => renderCategory({ item: subCat, level: level + 1 }))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Product Name"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Price"
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Pick an image" onPress={pickImage} />
      <Text style={{ marginVertical: 10 }}>
        Selected Category: {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'None'}
      </Text>
      <FlatList
        data={categories.filter(cat => !cat.parentId)}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        style={{ maxHeight: 200 }}
      />
      <Button title="Add Product" onPress={addProduct} />
    </View>
  );
}

const CategoriesScreen = () => {
  return (
    <View><Text>CategoriesScreen</Text></View>
  )
}

// const AddCategoryScreen = () => {
//   return (
//     <View><Text>AddCategoryScreen</Text></View>
//   )
// }
const AddCategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState(null);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categoriesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCategories(categoriesList);
  };

  const addCategory = async () => {
    if (!categoryName) return;
    try {
      await addDoc(collection(db, 'categories'), {
        name: categoryName,
        parentId: parentCategoryId,
        createdAt: new Date().toISOString()
      });
      setCategoryName('');
      setParentCategoryId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const renderCategory = ({ item, level = 0 }) => {
    const subCategories = categories.filter(cat => cat.parentId === item.id);
    return (
      <View style={{ marginLeft: level * 20 }}>
        <TouchableOpacity
          onPress={() => setParentCategoryId(item.id)}
          style={styles.categoryItem}
        >
          <Text style={styles.categoryText}>{item.name}</Text>
        </TouchableOpacity>
        {subCategories.map(subCat => renderCategory({ item: subCat, level: level + 1 }))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category Management</Text>

      {/* Add Category Form */}
      <View style={styles.formContainer}>
        <TextInput
          value={categoryName}
          onChangeText={setCategoryName}
          placeholder="Enter category name"
          style={styles.input}
        />
        <Text style={styles.label}>
          Parent: {parentCategoryId ? categories.find(c => c.id === parentCategoryId)?.name : 'None'}
        </Text>
        <Button title="Add Category" onPress={addCategory} />
      </View>

      {/* Category List */}
      <FlatList
        data={categories.filter(cat => !cat.parentId)}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
  


}


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
    // <NavigationContainer>
    //   <Drawer.Navigator>
    //     <Drawer.Screen name="Home" component={HomeScreen} />
    //   </Drawer.Navigator>
    // </NavigationContainer>
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Main">
        <Drawer.Screen name="Main" component={MainStack} />
        <Drawer.Screen name="Products" component={ProductListScreen} />
        <Drawer.Screen name="Add Product" component={AddProductScreen} />
        {/* <Drawer.Screen name="Categories" component={CategoryStack} /> */}
        <Drawer.Screen name="Categories" component={CategoriesScreen} />
        <Drawer.Screen name="Add Category" component={AddCategoryScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  formContainer: { marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  label: { marginBottom: 10 },
  list: { flex: 1 },
  categoryItem: { padding: 10 },
  categoryText: { fontSize: 16 }
});

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
