// components/ChatScreen.tsx
import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, StyleSheet, Text, ListRenderItem, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { SwipeableMessage } from '../components/SwipeableMessage';
import { Message } from '../types/types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const testMessages: Message[] = [
  { id: '1', text: "Hey there! How's it going?", sender: 'other' },
  { id: '2', text: "I'm doing great, thanks for asking! How about you?", sender: 'user' },
  { id: '3', text: "That's wonderful to hear! I'm doing well too.", sender: 'other' },
  { id: '4', text: "By the way, have you tried the new restaurant downtown?", sender: 'other' },
  { id: '5', text: "Not yet, but I've heard good things about it. Want to check it out this weekend?", sender: 'user' },
];

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(testMessages);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const replyHeight = useSharedValue(0);

  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        replyTo: replyingTo,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');
      cancelReply();
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [inputText, replyingTo]);

  const handleReply = useCallback((message: Message) => {
    setReplyingTo(message);
    replyHeight.value = withTiming(60, { duration: 300, easing: Easing.inOut(Easing.ease) });
  }, []);

  const cancelReply = useCallback(() => {
    replyHeight.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
    setReplyingTo(null);
  }, []);

  const replyAnimatedStyle = useAnimatedStyle(() => ({
    height: replyHeight.value,
    opacity: replyHeight.value === 0 ? 0 : 1,
  }));

  const renderMessage: ListRenderItem<Message> = useCallback(
    ({ item }) => <SwipeableMessage message={item} onReply={handleReply} />,
    []
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.bottomContainer}>
        <Animated.View style={[styles.replyContainer, replyAnimatedStyle]}>
          {replyingTo && (
            <>
              <TouchableOpacity onPress={cancelReply} style={styles.backButton}>
                <Icon name="keyboard-arrow-left" size={24} color="#075E54" />
              </TouchableOpacity>
              <View style={styles.replyContent}>
                <Text style={styles.replyingToText}>Replying to {replyingTo.sender === 'user' ? 'Yourself' : 'Other'}</Text>
                <Text numberOfLines={1} style={styles.replyText}>{replyingTo.text}</Text>
              </View>
              <TouchableOpacity onPress={cancelReply} style={styles.closeButton}>
                <Icon name="close" size={24} color="#075E54" />
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icon name="send" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  flatListContent: {
    paddingVertical: 10,
  },
  bottomContainer: {
    backgroundColor: '#ECE5DD',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#075E54',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyContainer: {
    backgroundColor: '#ECE5DD',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D1',
  },
  backButton: {
    marginRight: 10,
  },
  replyContent: {
    flex: 1,
  },
  replyingToText: {
    color: '#075E54',
    fontWeight: 'bold',
    fontSize: 14,
  },
  replyText: {
    color: '#6B6B6B',
    fontSize: 14,
  },
  closeButton: {
    marginLeft: 10,
  },
});