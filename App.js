import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Focus } from './src/features/focus/Focus';
import { Timer } from './src/features/timer/Timer';
import { colors } from './src/utils/colors';
import { spacing } from './src/utils/sizes';
import {FocusHistory} from './src/features/focus/FocusHistory';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

const addFocusHistorySubjectWIthStatus = (subject, status) => {
  setFocusHistory([...focusHistory, {key: String(focusHistory.length + 1), subject, status}])
}


const onClear = () => {
    setFocusHistory([]);
}

const saveFocusHistory = async() => {
  try {
    await AsyncStorage.setItem("focusHistory", JSON.stringify(focusHistory));
  }catch(e){
    console.log(e);
  }
}


const loadFocusHistory = async () => {
  try{
    const history = await AsyncStorage.getItem("focusHistory");

    if(history && JSON.parse(history).length){
      setFocusHistory(JSON.parse(history));
    }
  }
  catch(e){
    console.log(e);
  }
}

useEffect(() => {
  loadFocusHistory();
}, [])

useEffect(() => {
  saveFocusHistory();
  
}, [focusHistory])

const STATUSES = {
  COMPLETE: 1,
  CANCELLED: 2,
}

  useEffect(() => {
    if(focusSubject){
    }
  }, [focusSubject])

  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer focusSubject={focusSubject} onTimerEnd = {() => {
          addFocusHistorySubjectWIthStatus(focusSubject, STATUSES.COMPLETE)
          setFocusSubject(null);
        }}
        clearSubject = {() => {
          addFocusHistorySubjectWIthStatus(focusSubject, STATUSES.CANCELLED);
                    setFocusSubject(null);

          }}
         />
      ) : (
        <View style = {{flex:1}}>
        <Focus addSubject={setFocusSubject} />
        <FocusHistory focusHistory = {focusHistory} onClear = {() => {
          onClear();
        }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.lg,
    backgroundColor: colors.darkBlue,
  },
});
