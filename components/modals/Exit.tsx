import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const Exit = ({
  visible,
  onRequestClose,
  handleExit,
  message,
}: {
  visible: boolean;
  onRequestClose: () => void;
  handleExit?: () => void;
  message?: string;
}) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Modal
        visible={visible}
        onRequestClose={onRequestClose}
        transparent={true}
        statusBarTranslucent={true}
        animationType="fade"
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <TouchableWithoutFeedback onPress={onRequestClose}>
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            />
          </TouchableWithoutFeedback>

          <View
            style={{
              width: '85%',
              justifyContent: 'space-evenly',
              backgroundColor: 'white',
              paddingVertical: '8%',
              paddingHorizontal: '5%',
              gap: 20,
            }}
          >
            <Text
              style={{
                color: '#000000',
                fontFamily: 'SpaceMonoBold',
                fontSize: 18,
                textAlign: 'center',
              }}
            >
              DO YOU REALY WANT TO EXIT?
            </Text>
            <Text
              style={{
                color: '#FF0066',
                fontSize: 18,
                textAlign: 'center',
                fontFamily: 'SpaceMonoBold',
                fontWeight: 'semibold',
              }}
            >
              {message
                ? message
                : 'You are on last step,\nFinish your store setup'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 12,
                paddingHorizontal: 4,
              }}
            >
              <Text
                onPress={handleExit}
                style={{
                  fontFamily: 'SpaceMonoBold',
                  fontWeight: 'semibold',
                  color: '#FF0066',
                  borderRadius: 8,
                  borderWidth: 1,
                  padding: 8,
                  flex: 1,
                  textAlign: 'center',
                  borderColor: '#FF0066',
                  fontSize: 17,
                }}
                numberOfLines={1}
              >
                Exit
              </Text>
              <Text
                numberOfLines={1}
                onPress={onRequestClose}
                className="text-right"
                style={{
                  fontFamily: 'SpaceMonoBold',
                  fontWeight: 'semibold',
                  color: '#fff',
                  fontSize: 17,
                  borderRadius: 8,
                  borderWidth: 1,
                  padding: 8,
                  flex: 1,
                  textAlign: 'center',
                  borderColor: '#0088EB',
                  backgroundColor: '#0088EB',
                }}
              >
                Continue
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Exit;
