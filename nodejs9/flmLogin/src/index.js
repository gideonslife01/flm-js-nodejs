import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './LoginScreen'; 
import MainScreen from './MainScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'LoginScreen' }} />
          <Stack.Screen name="MainScreen" component={MainScreen} options={{ title: 'MainScreen' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;


/*
- 프로젝트 생성
npx @react-native-community/cli@latest init AwesomeProject

- 모듈
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npx pod-install // 모듈 설치 후에는 반드시 꼬박 꼬박 해줄 것 안그러면 오류남.

npx react-native init 프로젝트명 # 새 프로젝트 생성 시
npm install react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/stack axios
npx pod-install # iOS 사용자만 해당


실해안될경우 android skd 환경 변수 문제
- android
1).bash_profile
nano ~/.bash_profile
export ANDROID_HOME=/Users/gimdaegyeong/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH
source ~/.bash_profile -->이거 실행하고  npm run android하면 작동하는 경우 있음.


or


2)android directory내 에서 local.properties 파일 설정:

프로젝트의 android/local.properties 파일에 sdk.dir 경로를 설정할 수도 있습니다.
android/local.properties 파일을 열고 다음 줄을 추가합니다. YOUR_ANDROID_SDK_PATH를 실제 Android SDK 경로로 바꿉니다.
sdk.dir=YOUR_ANDROID_SDK_PATH
예시: sdk.dir=/Users/gimdaegyeong/Library/Android/sdk


- ios
ios디렉토리 내에서
npx pod-install // 모듈 설치 후에는 반드시 꼬박 꼬박 해줄 것 안그러면 오류남.

*/