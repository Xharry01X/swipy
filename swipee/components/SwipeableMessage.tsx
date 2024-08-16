// components/SwipeableMessage.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Message } from '../types/types';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SwipeableMessageProps {
  message: Message;
  onReply: (message: Message) => void;
}

const SWIPE_THRESHOLD = -80;
const SCREEN_WIDTH = Dimensions.get('window').width;

export const SwipeableMessage: React.FC<SwipeableMessageProps> = ({ message, onReply }) => {
  const translateX = useSharedValue(0);

  const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number }>({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = Math.max(SWIPE_THRESHOLD, Math.min(0, context.startX + event.translationX));
    },
    onEnd: () => {
      const shouldReply = translateX.value < SWIPE_THRESHOLD / 2;
      if (shouldReply) {
        runOnJS(onReply)(message);
      }
      translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
    },
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rReplyContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [SWIPE_THRESHOLD, 0], [1, 0], Extrapolate.CLAMP),
    transform: [
      {
        translateX: interpolate(translateX.value, [SWIPE_THRESHOLD, 0], [0, -50], Extrapolate.CLAMP),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.replyContainer, rReplyContainerStyle]}>
        <Icon name="reply" size={20} color="#FFFFFF" />
      </Animated.View>
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View
          style={[
            styles.messageContainer,
            message.sender === 'user' ? styles.userMessage : styles.otherMessage,
            rStyle,
          ]}
        >
          {message.replyTo && (
            <View style={styles.replyToContainer}>
              <Text style={styles.replyToText}>
                {message.replyTo.sender === 'user' ? 'You' : 'Other'}
              </Text>
              <Text numberOfLines={1} style={styles.replyToMessage}>
                {message.replyTo.text}
              </Text>
            </View>
          )}
          <Text style={[styles.messageText, message.sender === 'user' ? styles.userMessageText : styles.otherMessageText]}>
            {message.text}
          </Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    marginLeft: 'auto',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    marginRight: 'auto',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#000000',
  },
  otherMessageText: {
    color: '#000000',
  },
  replyContainer: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#128C7E',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  replyToContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#128C7E',
    paddingLeft: 8,
    marginBottom: 4,
  },
  replyToText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#128C7E',
  },
  replyToMessage: {
    fontSize: 14,
    color: '#757575',
  },
});