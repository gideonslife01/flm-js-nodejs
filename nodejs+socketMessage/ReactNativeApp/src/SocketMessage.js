import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView } from 'react-native';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SocketMessage = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [user, setUser] = useState(''); // 사용자 정보를 저장할 상태 추가 / Add a state to store user innformation
  const scrollViewRef = useRef();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUserJson = await AsyncStorage.getItem('user');
        if (storedUserJson) {
          const userData = JSON.parse(storedUserJson);
          setUser(userData.name || userData.userId || '알 수 없는 사용자/unknown user'); // users name or Id
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };

    loadUser();

    // Node.js 서버 주소 (필요에 따라 변경)
    const newSocket = io('http://192.168.0.10:3000');

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('서버에 연결되었습니다.');
    });

    newSocket.on('disconnect', () => {
      console.log('서버 연결이 끊어졌습니다.');
    });

    // 서버로부터 메시지를 수신하는 이벤트
    newSocket.on('serverMessage', (data) => {
      setReceivedMessages((prevMessages) => [...prevMessages, data.text]);
      // 메시지가 추가될 때 스크롤을 아래로 이동
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100); // 약간의 딜레이를 주어 렌더링 후 스크롤
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제 (선택 사항)
    return () => {
      newSocket.disconnect();
    };
  }, []); // 빈 의존성 배열을 사용하여 컴포넌트 마운트 시 한 번만 실행

  const sendMessage = () => {
    if (socket && message && user) {
      const messageToSend = `${user}:${message}`;
      socket.emit('clientMessage', { text: messageToSend });
      setMessage('');
    } else if (!user) {
      console.warn('사용자 정보가 없습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Socket.IO 테스트</Text>
      <View style={styles.messageContainer}>
        <Text>받은메세지/Received Message</Text>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => {
            // 초기 로딩 시에도 스크롤을 아래로 이동 (선택 사항)
            if (receivedMessages.length > 0) {
              scrollViewRef.current?.scrollToEnd({ animated: false });
            }
          }}
        >
          {receivedMessages.map((msg, index) => (
            <Text key={index}>{msg}</Text>
          ))}
        </ScrollView>
      </View>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="메시지를 입력하세요./Please enter your message"
      />
      <Button title="보내기/send" onPress={sendMessage} />
    </View>
  );
};

// SocketMessage.js
const styles = StyleSheet.create({
  container: {
    flex: 1, // 또는 height: '100%' 등
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  messageContainer: {
    flex: 1, // 또는 flexGrow: 1
    marginBottom: 20,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SocketMessage;