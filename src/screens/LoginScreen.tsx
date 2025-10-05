import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TextInputField } from '../components/TextInputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginScreen = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Za-z]/, 'Password must contain at least one letter')
      .matches(/\d/, 'Password must contain at least one number')
      .required('Password is required'),
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Welcome back</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              setSubmitting(true);
              setTimeout(() => {
                setSubmitting(false);
                if (
                  values.email.toLowerCase() !== 'demo@example.com' ||
                  values.password !== 'Password1'
                ) {
                  setErrors({ email: 'Invalid credentials', password: ' ' });
                } else {
                  // success case
                  console.log('Login success', values);
                }
              }, 800);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <TextInputField
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={touched.email ? errors.email ?? null : null}
                />

                <TextInputField
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  placeholder="Enter your password"
                  secureTextEntry
                  autoCapitalize="none"
                  error={touched.password ? errors.password ?? null : null}
                />

                <PrimaryButton
                  title={isSubmitting ? 'Signing in...' : 'Sign in'}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                />

                <View style={styles.row}>
                  <Text style={styles.small}>Don't have an account?</Text>
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.link}> Sign up</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    paddingVertical: 24,
  },
  generalError: {
    color: '#D9534F',
    textAlign: 'center',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  small: {
    color: '#666',
  },
  link: {
    color: '#1064A3',
    fontWeight: '600',
  },
});

export default LoginScreen;
