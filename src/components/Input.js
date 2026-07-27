import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  icon,
  editable = true,
  multiline = false,
  rightIcon,
  onRightIconPress,
  style,
  error,
  required = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.inputContainer, error && styles.inputError, !editable && styles.inputDisabled]}>
        {icon && (
          <Ionicons name={icon} size={20} color="#94A3B8" style={styles.icon} />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          multiline={multiline}
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            rightIcon && styles.inputWithRightIcon,
            multiline && styles.multiline,
          ]}
        />
        {rightIcon && (
          <Ionicons
            name={rightIcon}
            size={22}
            color="#64748B"
            style={styles.rightIcon}
            onPress={onRightIconPress}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  required: {
    color: '#DC2626',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    opacity: 0.7,
  },
  icon: {
    marginLeft: 14,
  },
  rightIcon: {
    marginRight: 14,
    padding: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0F172A',
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
  inputWithRightIcon: {
    paddingRight: 4,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
});

export default Input;
