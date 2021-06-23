import React, { useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

import * as interfaces from '../../components/ui/Interfaces/Interface';

export default function landingPage() {
  const arr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const [state, setState] = useState('red');

  function renderScreen(state) {
    switch (state) {
      case 'scanning':
        return interfaces.scanning();
      case 'red':
        return interfaces.stop();
    }
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#0B5165' }}>
        <View style={{ flex: 0.15, flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../../assets/leanbot.png')}
            style={{ margin: 20 }}
          />
          <Text style={{ fontSize: 20, color: '#31B7DE' }}>Leanbot</Text>
        </View>

        <View style={{ flex: 0.85, flexDirection: 'row' }}>
          <View
            style={{
              flex: 0.1,
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={() => setState('scanning')}>
              <Image
                source={require('../../assets/ic_settings_24px.png')}
                style={{ margin: 20, width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
            {renderScreen(state)}
          </View>
          <View style={{ flex: 0.1, flexDirection: 'column' }}></View>
        </View>
      </View>
    </>
  );
}
