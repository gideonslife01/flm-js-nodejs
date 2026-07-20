import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native'; // navigation prop 사용을 위한 hook

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [role, setRole] = useState('user');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [birthdateError, setBirthdateError] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  const navigation = useNavigation(); // navigation hook 초기화

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkUsername = async () => {
    if (username.length < 3) {
      setUsernameError('아이디는 3자 이상이어야 합니다.');
      setIsUsernameAvailable(false);
      return;
    }
    try {
      const response = await fetch(`http://192.168.0.10:3000/checkUsername?username=${encodeURIComponent(username)}`);
      const result = await response.json();
      if (response.ok && result.available) {
        setUsernameError('');
        setIsUsernameAvailable(true);
        Alert.alert('알림', '사용 가능한 아이디입니다.');
      } else {
        setUsernameError(result.error || '이미 사용 중인 아이디입니다.');
        setIsUsernameAvailable(false);
      }
    } catch (error) {
      setUsernameError('중복 확인 중 오류가 발생했습니다.');
      setIsUsernameAvailable(false);
    }
  };

  const handleSignup = async () => {
    let isValid = true;
    if (username.trim() === '') {
      setUsernameError('아이디를 입력하세요.');
      isValid = false;
    } else if (!isUsernameAvailable) {
      setUsernameError('아이디 중복 확인이 필요합니다.');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!validateEmail(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    } else {
      setPasswordConfirmError('');
    }

    if (name.trim() === '') {
      setNameError('이름을 입력하세요.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!birthdate) {
      setBirthdateError('생년월일을 선택하세요.');
      isValid = false;
    } else {
      setBirthdateError('');
    }

    if (isValid) {
      try {
        const response = await fetch('http://192.168.0.10:3000/AppsignupProc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, name, email, password, phone, address, birthdate, role }),
        });
        const result = await response.json();
        if (response.ok) {
          Alert.alert('알림', result.message || '회원가입이 완료되었습니다.', [
            { text: '확인', onPress: () => navigation.navigate('MainScreen') }, // 성공 시 MainScreen으로 이동
          ]);
        } else {
          Alert.alert('알림', result.error || '회원가입에 실패했습니다.');
        }
      } catch (error) {
        console.error('회원가입 오류:', error);
        Alert.alert('알림', '서버와 통신 중 오류가 발생했습니다.');
      }
    }
  };

  const showDatePicker = () => {
    setShowCalendar(true);
  };

  const onDayPress = (day) => {
    setBirthdate(day.dateString);
    setShowCalendar(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <View style={styles.inputGroup}>
        <Text>아이디:</Text>
        <View style={styles.inputButtonWrapper}>
          <TextInput
            style={[styles.input, { width: 250 }]}
            value={username}
            onChangeText={setUsername}
            required
            minLength={3}
            maxLength={50}
          />
          <Button title="중복 확인" onPress={checkUsername} />
        </View>
        {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text>이름:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          required
          maxLength={50}
        />
        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text>이메일:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          required
          maxLength={100}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text>비밀번호 (8자 이상):</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
          minLength={8}
        />
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text>비밀번호 확인:</Text>
        <TextInput
          style={styles.input}
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry
          required
          minLength={8}
        />
        {passwordConfirmError ? <Text style={styles.error}>{passwordConfirmError}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text>전화번호 (선택):</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={20}
        />
        {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text>주소 (선택):</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          maxLength={255}
        />
        {addressError ? <Text style={styles.error}>{addressError}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text>생년월일:</Text>
        <View style={styles.datePickerContainer}>
          <TextInput
            style={styles.dateInput}
            value={birthdate}
            placeholder="YYYY-MM-DD"
            editable={false}
          />
          <Button title="선택" onPress={showDatePicker} />
        </View>
        {birthdateError ? <Text style={styles.error}>{birthdateError}</Text> : null}
      </View>

      {showCalendar && (
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            [birthdate]: { selected: true, marked: true, selectedColor: 'blue' },
          }}
        />
      )}

      <View style={styles.radioGroup}>
        <Text>역할:</Text>
        <View style={styles.radioItem}>
          <Button
            title={role === 'user' ? '● 일반 사용자' : '○ 일반 사용자'}
            onPress={() => setRole('user')}
          />
        </View>
        <View style={styles.radioItem}>
          <Button
            title={role === 'admin' ? '● 관리자' : '○ 관리자'}
            onPress={() => setRole('admin')}
          />
        </View>
      </View>

      <Button title="회원가입" onPress={handleSignup} disabled={!isUsernameAvailable} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioItem: {
    marginLeft: 10,
  },
});

export default SignupScreen;