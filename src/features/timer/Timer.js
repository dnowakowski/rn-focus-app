import React, { useState } from 'react';
import { View, Text, StyleSheet, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { colors } from '../../utils/colors';
import { spacing } from '../../utils/sizes';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import {Timing} from './Timing';
import {useKeepAwake} from 'expo-keep-awake';

const DEFAULT_TIME = 0.1;

export const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
  useKeepAwake();
  const [minutes, setMinutes] = useState(DEFAULT_TIME);
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);


  const onProgress = (progress) => {
    setProgress(progress);
  };

  const vibrate = () => {
    if(Platform.OS === 'ios'){
      const interval = setInteval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 10000)
    }
    else{
      Vibration.vibrate(10000);
    }
  }

  const onEnd = () => {
    setMinutes(DEFAULT_TIME);
    onProgress(1);
    setIsStarted(false);
    vibrate();
    onTimerEnd();
  }

  const changeTime = (min) => {
    setMinutes(min);
    onProgress(1);
    setIsStarted(false);
    
  }
  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown minutes = {minutes} isPaused={!isStarted} onProgress={onProgress} onEnd = {onEnd} />
      </View>
      <View style={{ paddingTop: spacing.xxl }}>
        <Text style={styles.title}>Focusing on: </Text>
        <Text style={styles.task}>{focusSubject}</Text>
      </View>
      <View>
        <View style={{ paddingTop: spacing.sm }}>
          <ProgressBar
            progress={progress}
            color="#5E84E2"
            style={{ height: 10 }}
          />
        </View>
      </View>
        <View style={styles.buttonWrapper}>
          <Timing changeTime={changeTime} />
        </View>
      <View style={styles.buttonWrapper}>
        {!isStarted ? (
          <RoundedButton title="start" onPress={() => setIsStarted(true)} />
        ) : (
          <RoundedButton title="stop" onPress={() => setIsStarted(false)} />
        )}
      </View>
        <View style = {styles.clearSubject}>
        <RoundedButton title = "clear" size = {50} onPress = {() => {
          clearSubject();
        }}/>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.white,
    textAlign: 'center',
  },

  task: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  countdown: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flex: 0.3,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 25
  }
});
