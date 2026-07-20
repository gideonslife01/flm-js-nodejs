import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

const SamplePage = () => {
  const [greeting, setGreeting] = useState('안녕하세요!');

  const changeGreeting = () => {
    setGreeting('만나서 반갑습니다!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{greeting}</Text>
      <Button title="인사말 변경" onPress={changeGreeting} />
      <Text style={styles.description}>
        이것은 간단한 리액트 네이티브 샘플 페이지입니다.
        버튼을 누르면 인사말이 바뀝니다.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    color: '#555',
  },
});

export default SamplePage;