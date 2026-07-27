import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: styles.bgSecondary, text: styles.textSecondary };
      case 'danger':
        return { bg: styles.bgDanger, text: styles.textWhite };
      case 'outline':
        return { bg: styles.bgOutline, text: styles.textPrimary };
      default:
        return { bg: styles.bgPrimary, text: styles.textWhite };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        variantStyles.bg,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563EB' : '#FFFFFF'} size="small" />
      ) : (
        <Text style={[styles.text, variantStyles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  bgPrimary: {
    backgroundColor: '#2563EB',
  },
  bgSecondary: {
    backgroundColor: '#F1F5F9',
  },
  bgDanger: {
    backgroundColor: '#DC2626',
  },
  bgOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#334155',
  },
  textPrimary: {
    color: '#2563EB',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
