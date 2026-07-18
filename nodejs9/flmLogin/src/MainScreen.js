import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainScreen = ({ navigation }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUserJson = await AsyncStorage.getItem('user');
        if (storedUserJson) {
          const user = JSON.parse(storedUserJson);
          console.log('자동 로그인Automatic logiin:', user);
          setLoggedInUser(user);
        } else {
          // 로그인 정보가 없으면 로그인 화면으로 이동
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('로그인 상태 확인 에러 Login status check error:', error);
        // 오류 발생 시 로그인 화면으로 이동 (선택 사항)
        navigation.navigate('LoginScreen');
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setLoggedInUser(null); // 상태를 null로 업데이트
      console.log('로그아웃 성공 Logout successful');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('로그아웃 에러Logout Error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>메인 화면MainScreen!</Text>
      {loggedInUser && (
        <View style={styles.userInfo}>
          <Text>환영합니다Welcome!, {loggedInUser.name} 님!</Text>
          <Text>아이디(ID): {loggedInUser.userId}</Text>
        </View>
      )}
      <Button title="로그아웃Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
});

export default MainScreen;