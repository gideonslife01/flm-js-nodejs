import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          console.log('자동 로그인 시도:', storedUser);
          // 저장된 사용자 정보가 있다면, 서버에 유효성 검증을 거치는 것이 좋습니다.
          // 여기서는 간단하게 메인 화면으로 이동하는 예시를 보여줍니다.
          navigation.navigate('MainScreen');
        }
      } catch (error) {
       // console.error('로그인 상태 확인 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.10:3000/ApploginProc', { // 실제 서버 IP 및 포트로 변경
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        // 로그인 성공 처리
        console.log('로그인 성공Login successful');
        Alert.alert('로그인 성공Login successful', '로그인성공Login successful.');
        // 서버에서 사용자 정보를 JSON 형태로 응답한다고 가정합니다.
        const userData = await response.json();
        // AsyncStorage에 사용자 정보 저장 (필요한 정보만 선택적으로 저장)
        await AsyncStorage.setItem('user', JSON.stringify({ userId: userData.userId, name: userData.name }));
        navigation.navigate('MainScreen');
      } else {
        // 로그인 실패 처리
        const text = await response.text();
        console.log('로그인 실패Login Failed:', text);
        Alert.alert('로그인 실패Login Failed', '아이디 또는 비밀번호를 확인해주세요.\nPlease check your ID or password');
      }
    } catch (error) {
      console.error('로그인 요청 에러Login error:', error);
      Alert.alert('오류error', '로그인 요청 중 오류가 발생했습니다.\nAn error occurred while requesting login.');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인Login</Text>
      <TextInput
        style={styles.input}
        placeholder="아이디ID"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="로그인Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;