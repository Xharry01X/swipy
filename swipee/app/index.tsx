import { ChatScreen } from '@/screens/ChatScreen';
import { Image, StyleSheet, Platform, View, Text, SafeAreaView, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



export default function HomeScreen() {
  return (
   <>
   <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ChatScreen />
      </SafeAreaView>
    </GestureHandlerRootView>
   </>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1E1E1E',
    },
  });