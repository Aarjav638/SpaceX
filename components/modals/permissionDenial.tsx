import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ThemedText } from '../ThemedText';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PermissionDenial = ({
  handleRequestPremission,
  visible,
  settingsOptions,
}: {
  handleRequestPremission: () => void;
  visible: boolean;
  settingsOptions: boolean;
}) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Modal
        transparent={true}
        statusBarTranslucent={true}
        visible={visible}
        animationType="fade"
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          />
        </TouchableWithoutFeedback>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{
              width: SCREEN_WIDTH * 0.85,
              height: 'auto',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              borderRadius: 20,
              padding: '5%',
              backgroundColor: '#fff',
              gap: 10,
            }}
          >
            <View
              style={{
                backgroundColor: '#909090',
                borderRadius: 9999,
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: 1,
                marginBottom: 10,
              }}
            >
              <Ionicons name="close" size={80} color={'#000'} />
            </View>
            <ThemedText
              maxFontSizeMultiplier={1.2}
              style={{
                fontFamily: 'SpaceMonoBold',
                color: '#000',
                textAlign: 'center',
                fontSize: 25,
              }}
            >
              Location Permission{'\n\n'}
              <ThemedText
                style={{
                  fontFamily: 'SpaceMonoBold',
                  color: '#000',
                  fontSize: 32,
                }}
              >
                Failed
              </ThemedText>
            </ThemedText>

            <ThemedText
              maxFontSizeMultiplier={1.2}
              style={{
                color: '#5F5F5F',
                fontFamily: 'SpaceMono',
                textAlign: 'center',
                fontSize: 15,
              }}
            >
              You denied to access your location, Please Allow Permission to
              contiue to see details
            </ThemedText>
            <TouchableOpacity
              style={{
                marginTop: 10,
                width: '100%',

                borderRadius: 10,
                overflow: 'hidden',
              }}
              onPress={handleRequestPremission}
            >
              <LinearGradient
                colors={[
                  'rgba(143, 149, 152, 0.5)',
                  'rgba(65, 105, 225, 0.4)',
                  'rgba(255, 140, 0, 0.2)',
                ]}
                style={{
                  padding: '4%',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                start={[0, 0]}
                end={[1, 1]}
                locations={[0, 0.5, 1]}
              >
                <ThemedText
                  maxFontSizeMultiplier={1.2}
                  style={{
                    color: 'rgba(0,0,0,0.7)',
                    fontFamily: 'SpaceMonoBold',
                    fontSize: 18,
                  }}
                  numberOfLines={1}
                >
                  {settingsOptions ? 'Open Settings' : 'Request Permission'}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PermissionDenial;
