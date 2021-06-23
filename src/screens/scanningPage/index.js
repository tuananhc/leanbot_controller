import React, { useState } from 'react';
import {
  Alert,
  Image,
  Text,
  PermissionsAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/ui/Buttons/Button';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import DialogInput from 'react-native-dialog-input';
import Modal from 'react-native-modal';
import KeepAwake from 'react-native-keep-awake';

import styles from './style';
import * as interfaces from '../../components/ui/Interfaces/Interface';

const bleManager = new BleManager();

export default function App() {
  const [devices, setDevices] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceID, setDeviceID] = useState("")
  const [serviceUUID, setServiceUUID] = useState("")
  const [characteristicUUID, setCharacteristicUUID] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataReceived, setDataReceived] = useState("");
  const [appState, setAppState] = useState("scanning");

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Location permission for bluetooth scanning',
        message: 'whatever',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  const permission = requestLocationPermission();

  function onScan() {
    setLoading(true);
    if (permission) {
      let numScans = 0;
      let len = 0;
      var distinctDevices = [];
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log(JSON.stringify(error));
        }
        if (len >= 15 || numScans > 50) {
          bleManager.stopDeviceScan();
          setLoading(false);
        }
        if (device) {
          if (!distinctDevices.some(elem => elem.id === device.id)) {
            var item = {}
            item['name'] = device.name;
            item['id'] = device.id;
            distinctDevices = [...distinctDevices, item]
            setDevices(distinctDevices);
            len += 1;
          }
          numScans += 1;
        }
      })
    }
  }

  // handle change of bluetooth state
  bleManager.onStateChange((state) => {
    if (state === 'PoweredOff') {
      setAppState('disconnected')
    }
    if (state === 'PoweredOn') {
      setAppState('scanning')
    }
  })

  function connectToDevice(deviceId) {
    setLoading(false);
    bleManager.stopDeviceScan();
    bleManager.connectToDevice(deviceId).then((device) => {
      setAppState('connected');
      return device.discoverAllServicesAndCharacteristics()
    })
      .then((device) => {
        device.services().then((services) => {
          services.forEach(service => {
            service.characteristics().then((characteristics) => {
              characteristics.forEach((characteristic) => {
                setServiceUUID(characteristic.serviceUUID);
                setCharacteristicUUID(characteristic.uuid);
                device.monitorCharacteristicForService(service.uuid, characteristic.uuid, (error, characteristic) => {
                  if (error) {
                    console.log(JSON.stringify(error))
                  } else {
                    switch (parseInt(base64.decode(characteristic.value))) {
                      case 1:
                        setAppState("stop");
                        break;
                      case 2:
                        setAppState("obstacle");
                        break;
                      case 3:
                        setAppState("danger");
                        break;
                      default:
                        setAppState("normal");
                        break;
                    }
                    setDataReceived(base64.decode(characteristic.value));
                  }
                })
              })
            })
          })
        });
      }), (error) => {
        console.log(error.message);
      }
  }

  function sendAction(action) {
    bleManager.writeCharacteristicWithResponseForDevice(
      deviceID,
      serviceUUID,
      characteristicUUID,
      base64.encode(action))
  }

  function renderItem({ item }) {
    return (
      <TouchableHighlight onPress={() => {
        Alert.alert(
          '',
          'Connect to device?',
          [
            {
              text: 'No',
              onPress: () => { }
            },
            {
              text: 'Yes',
              onPress: () => {
                setAppState('connecting');
                connectToDevice(item.id);
                setDeviceID(item.id)
              }
            }
          ]
        )
      }}
        style={{ marginTop: 5, padding: 3, justifyContent: 'flex-start' }}
        underlayColor='#e6e6e6'
      >
        <View style={{ flexDirection: 'row', }}>
          <Image
            source={require('../../assets/noun.png')}

            style={{ margin: 5, width: 30, height: 20 }}
          />
          <View style={{}}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {(item.name) ? item.name : "<unnamed>"}
            </Text>
            <Text style={{ opacity: 0.6, marginLeft: 10, fontSize: 12 }}>{item.id}</Text>
          </View>
          {(deviceID === item.id) ? (
            <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'flex-end' }}>
              <Image
                source={require('../../assets/tick.png')}
                style={{ width: 30, height: 20 }}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
      </TouchableHighlight>
    )
  }

  bleManager.onDeviceDisconnected(deviceID, () => {
    setAppState('disconnected');
    setDeviceID("");
  })

  function renderScreen(appState) {
    switch (appState) {
      case 'scanning':
        return (
          <>
            <View>
              {interfaces.scanning(devices, renderItem)}
            </View>
            {(deviceID !== '') ? (
              <View style={styles.connectedDeviceBox}>
                <Text style={{ color: 'white' }}>Connected to device {deviceID}</Text>
              </View>
            ) : (
              <></>
            )}
            <Button
              style={styles.scanningButton}
              loading={loading}
              onPress={onScan}>
              <Text
                style={{ fontSize: 14, color: '#ffff', fontWeight: 'bold' }}>
                SCAN
              </Text>
            </Button>
          </>
        );
      case 'connecting':
        return interfaces.waitingForConnection();
      case 'connected':
        return interfaces.connected();
      case 'obstacle':
        return interfaces.obstacle();
      case 'stop':
        return interfaces.stop();
      case 'obstacle':
        return interfaces.obstacle();
      case 'danger':
        return interfaces.danger();
      case 'normal':
        return interfaces.normal();
      case 'disconnected':
        return (
          <>
            {interfaces.disconnected()}
            <Button
              style={{
                marginTop: -30,
                width: 125,
                backgroundColor: '#208ECE',
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 30,
              }}
              loading={loading}
              onPress={() => {
                setAppState('scanning');
                onScan();
              }}>
              <Text
                style={{ fontSize: 14, color: '#ffff', fontWeight: 'bold' }}>
                SCAN
              </Text>
            </Button>
          </>
        )
      default:
        break;
    }
  }

  return (
    <>
      <KeepAwake />
      <Modal
        backdropColor={'black'}
        backdropOpacity={0.8}
        animationType='slide'
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
          {interfaces.scanning(devices, renderItem)}
          {(deviceID !== '') ? (
            <View style={styles.connectedDeviceBox}>
              <Text style={{ color: 'white' }}>Connected to device {deviceID}</Text>
            </View>
          ) : (
            <></>
          )}
          <Button
            style={styles.scanningButton}
            loading={loading}
            onPress={onScan}>
            <Text
              style={{ fontSize: 14, color: '#ffff', fontWeight: 'bold' }}>
              SCAN
              </Text>
          </Button>
        </View>
      </Modal>

      <DialogInput
        isDialogVisible={dialogVisible}
        title={'Send action to BLE device'}
        submitInput={(input) => {
          sendAction(input);
          setDialogVisible(false);
        }}
        closeDialog={() => { setDialogVisible(false) }}
      />
      <View style={{ flex: 1, backgroundColor: '#0B5165' }}>
        <View style={{ flex: 0.15, flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/leanbot.png')} style={{ margin: 20 }} />
          <Text style={{ fontSize: 20, color: '#31B7DE' }}>Leanbot</Text>
        </View>

        <View style={{ flex: 0.85, flexDirection: 'row' }}>
          <View style={{ flex: 0.1, flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 15, color: 'white' }}>{dataReceived}</Text>
            <TouchableOpacity onPress={(appState === 'scanning' ? () => { } : () => setDialogVisible(true))}>
              <Image source={require('../../assets/micon.png')} style={{ margin: 18, width: 22, height: 22 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={(appState === 'scanning' ? () => { } : () => setModalVisible(true))}>
              <Image source={require('../../assets/ic_settings_24px.png')} style={{ margin: 20, width: 20, height: 20 }} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.8, alignItems: 'center', }}>
            {renderScreen(appState)}
          </View>
          <View style={{ flex: 0.1, flexDirection: 'column' }}></View>
        </View>
      </View>
    </>
  )
}
