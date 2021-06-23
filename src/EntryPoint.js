import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import styles from './styles';

// màn hình scan thiết bị - trắng
export function scanning(data, renderItem) {
  return (
    <View style={styles.scanStyle}>
      <View style={styles.scanStyle2}>
        <Text style={{ color: '#31B7DE' }}>Danh sách thiết bị kết nối</Text>
      </View>
      <View style={{ paddingHorizontal: 10, flex: 0.85 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

// màn hình nguy hiểm - đỏ
export function danger() {
  return (
    <View style={styles.styleNotcn}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../../../assets/Group5895.png')}
          style={{ width: 100, height: 100 }}
        />
        <Image
          source={require('../../../assets/ic_cancel_24px.png')}
          style={{ width: 40, height: 40 }}
        />
      </View>
      <Text style={{ fontSize: 40, color: 'white', margin: 10 }}>Nguy hiểm</Text>
    </View>
  );
}

// màn hình chờ kết nối - mù tạc
export function waitingForConnection() {
  return (
    <View style={styles.styleWaiting}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../../../assets/Group5895.png')}
          style={{ width: 100, height: 100 }}
        />
        <Image
          source={require('../../../assets/ic_bluetooth_2.png')}
          style={{ width: 30, height: 48 }}
        />
      </View>
      <Text style={{ fontSize: 40, color: 'white', margin: 10 }}>
        Chờ kết nối...
      </Text>
    </View>
  );
}

// màn hình kết nối thành công - xanh lá cây
export function connected() {
  return (
    <View style={styles.connected}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../../../assets/Group5895.png')}
          style={{ width: 100, height: 100 }}
        />
        <Image
          source={require('../../../assets/ic_bluetooth_2.png')}
          style={{ width: 30, height: 48 }}
        />
      </View>
      <Text style={{ fontSize: 40, color: 'white', margin: 10 }}>
        Kết nối thành công
      </Text>
    </View>
  );
}

// màn hình dừng - tím
export function stop() {
  return (
    <View style={styles.stop}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../../../assets/Group5895.png')}
          style={{ width: 100, height: 100, marginLeft: 60 }}
        />
        <Image
          source={require('../../../assets/Stop.png')}
          style={{ width: 60, height: 60, marginLeft: 10 }}
        />
      </View>
      <Text style={{ fontSize: 40, color: 'white', margin: 10 }}>
        Dừng
      </Text>
    </View>
  );
}

// màn hình chạy bình thường - xanh dương
export function normal() {
  return (
    <View style={styles.normal}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../../../assets/Group5895.png')}
          style={{ width: 100, height: 100 }}
        />
      </View>
      <Text style={{ fontSize: 40, color: 'white', margin: 10 }}>
        Chạy bình thường
      </Text>
    </View>
  );
}

// màn hình vật cản - vàng
export function obstacle() {
  return (
    <View style={styles.obstacle}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../../../assets/Group5895.png')}
          style={{ width: 100, height: 100, marginLeft: 60 }}
        />
        <Image
          source={require('../../../assets/vatcan.png')}
          style={{ width: 70, height: 40 }}
        />
      </View>
      <Text style={{ fontSize: 40, color: 'white', margin: 10 }}>Vật cản</Text>
    </View>
  );
}
