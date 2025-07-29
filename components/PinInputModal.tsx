import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface PinInputModalProps {
  visible: boolean;
  onClose: () => void;
  onPinValid: () => void;
  title?: string;
  description?: string;
  correctPin?: string;
}

export default function PinInputModal({
  visible,
  onClose,
  onPinValid,
  title,
  description,
  correctPin = '123123'
}: PinInputModalProps) {
  const [pin, setPin] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { t } = useLanguage();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleNumberPress = (number: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length === 6) {
      setIsValidating(true);
      
      // Simulate validation delay
      setTimeout(() => {
        if (pin === correctPin) {
          onPinValid();
          setPin('');
          setIsValidating(false);
        } else {
          Alert.alert(
            t('error'),
            t('invalidPin'),
            [
              {
                text: t('tryAgain'),
                onPress: () => {
                  setPin('');
                  setIsValidating(false);
                }
              }
            ]
          );
        }
      }, 500);
    }
  };

  const handleCancel = () => {
    setPin('');
    onClose();
  };

  // Auto-submit when PIN reaches 6 digits
  useEffect(() => {
    if (pin.length === 6) {
      handleSubmit();
    }
  }, [pin]);

  const renderPinDots = () => {
    return (
      <View style={styles.pinDotsContainer}>
        {Array.from({ length: 6 }, (_, index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              {
                backgroundColor: index < pin.length ? colors.tint : '#E0E0E0',
                borderColor: colors.tint,
              }
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'backspace']
    ];

    return (
      <View style={styles.keypadContainer}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, keyIndex) => {
              if (key === 'backspace') {
                return (
                  <TouchableOpacity
                    key={keyIndex}
                    style={styles.keypadButton}
                    onPress={handleBackspace}
                    disabled={pin.length === 0}
                  >
                    <IconSymbol 
                      name="delete.left" 
                      size={24} 
                      color={pin.length === 0 ? '#CCC' : colors.text} 
                    />
                  </TouchableOpacity>
                );
              }
              
              if (key === '') {
                return <View key={keyIndex} style={styles.keypadButton} />;
              }

              return (
                <TouchableOpacity
                  key={keyIndex}
                  style={styles.keypadButton}
                  onPress={() => handleNumberPress(key)}
                  disabled={pin.length >= 6}
                >
                  <Text style={[styles.keypadText, { color: colors.text }]}>
                    {key}
                  </Text>
                  <Text style={[styles.keypadSubtext, { color: colors.text }]}>
                    {getKeypadSubtext(key)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const getKeypadSubtext = (key: string) => {
    const subtexts: { [key: string]: string } = {
      '2': 'ABC',
      '3': 'DEF',
      '4': 'GHI',
      '5': 'JKL',
      '6': 'MNO',
      '7': 'PQRS',
      '8': 'TUV',
      '9': 'WXYZ',
    };
    return subtexts[key] || '';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <IconSymbol name="xmark" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>
              {title || t('enterPinToContinue')}
            </Text>
          </View>

          {/* PIN Input Area */}
          <View style={styles.pinInputArea}>
            <Text style={[styles.description, { color: colors.text }]}>
              {description || t('enterPinDescription')}
            </Text>
            {renderPinDots()}
            <TouchableOpacity style={styles.forgotPinButton}>
              <Text style={[styles.forgotPinText, { color: colors.tint }]}>
                {t('forgotPin')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Keypad */}
          <View style={styles.keypadWrapper}>
            {renderKeypad()}
          </View>

          {/* Loading indicator */}
          {isValidating && (
            <View style={styles.loadingOverlay}>
              <Text style={[styles.loadingText, { color: colors.text }]}>
                {t('validatingPin')}
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width - 40,
    maxWidth: 400,
    padding: 24,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Compensate for close button
  },
  pinInputArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: 8,
  },
  forgotPinButton: {
    paddingVertical: 8,
  },
  forgotPinText: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  keypadWrapper: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
  },
  keypadContainer: {
    gap: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  keypadButton: {
    flex: 1,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  keypadText: {
    fontSize: 24,
    fontWeight: '600',
  },
  keypadSubtext: {
    fontSize: 10,
    marginTop: 2,
    opacity: 0.6,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 