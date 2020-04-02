import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Picker,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import config from '../config';
import scale from '../config/scale';
import {textStyles} from '../config/styles';

import TextInput from '../components/TextInput';
import endpoint from '../config/endpoint';
import {getUNIXTS} from "../utils/UNIXTS";
import generateHazard from '../utils/dummy-data/generate';
import db from '../model/database';

const myIcon = (
  <Icon
    name="hazard-lights"
    size={scale(50)}
    color={config.color.common.darkRed}
  />
);

const initialState = {
  waktuLaporan: null,
  judulHazard: '',
  detailLaporan: '',
  detailLokasi: '',
  lokasi: 'Lain-lain',
  subLokasi: 'Lain-lain',
  isSubmitting: false,
  isSuccess: false,
  isGenerating: false
};

export default class HazardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {...initialState};
  }

  db = () => {
    let database = null;
    try {
      database = db;
    } catch (e) {
      console.log(e);
    }
    return database;
  };

  onChangeText_judulHazard = text => {
    this.setState({judulHazard: text});
  };

  onChangeText_detailLaporan = text => {
    this.setState({detailLaporan: text});
  };

  onChangeText_detailLokasi = text => {
    this.setState({detailLokasi: text});
  };

  submittingData = async () => {
    const {
      judulHazard,
      detailLaporan,
      detailLokasi,
      lokasi,
      subLokasi,
    } = this.state;

    const data = {
      waktuLaporan: getUNIXTS(),
      judulHazard,
      detailLaporan,
      lokasi,
      subLokasi,
      detailLokasi,
    };

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const url = `${config.api}${endpoint.submit}`;
    const requestBody = {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      timeout: 500,
    };

    this.insertHazard(data);
    // this.postData(url, requestBody);
  };

  insertHazard = async ({
    waktuLaporan,
    judulHazard,
    detailLaporan,
    lokasi,
    subLokasi,
    detailLokasi
  }) => {
    const db = this.db();

    const hazardsCollection = db.collections.get('hazards');

    await db.action(async () => {
      let newHazard = null;

      function validation(data, isNumber=false) {
        if(isNumber && typeof data === 'number'){
            return data !== 0;
        }
        return data !== '';
      }

      try {
        if (
          validation(waktuLaporan, true) &&
          validation(judulHazard) &&
          validation(detailLaporan) &&
          validation(lokasi) &&
          validation(subLokasi) &&
          validation(detailLokasi)
        ) {
          newHazard = await hazardsCollection.create(hazard => {
            hazard.waktuLaporan = waktuLaporan;
            hazard.judulHazard = judulHazard;
            hazard.detailLaporan = detailLaporan;
            hazard.lokasi = lokasi;
            hazard.subLokasi = subLokasi;
            hazard.detailLokasi = detailLokasi;
          });
        }
      } catch (e) {
        console.log(e);
      }

      if (newHazard) {
        Alert.alert('Pemberitahuan', 'Data berhasil disimpan.');
        this.setState({
          ...initialState,
          isSubmitting: false,
          isSuccess: true,
        });
      } else {
        Alert.alert('Pemberitahuan', 'Data gagal disimpan.');
        this.setState({
          isSubmitting: false,
          isSuccess: false,
        });
      }
    });

        return await hazardsCollection.query().fetch()
  };

  postData = async (url, requestBody) => {
    const result = await fetch(url, requestBody)
      .then(response => response.json())
      .then(responseJson => {
        return (
          responseJson.status === 200 &&
          responseJson.message === 'Success created'
        );
      })
      .catch(error => {
        console.error(error);
        return false;
      });

    if (result) {
      Alert.alert('Pemberitahuan', 'Data berhasil dikirim.');
      this.setState({
        ...initialState,
        isSubmitting: false,
        isSuccess: true,
      });
    } else {
      Alert.alert('Pemberitahuan', 'Data gagal dikirim.');
      this.setState({
        isSubmitting: false,
        isSuccess: false,
      });
    }
  };

  onSubmit = () => {
    this.setState({isSubmitting: true}, () => this.submittingData());
  };

  _renderSubmitButton = () => {
    const {isSubmitting} = this.state;

    return (
      <TouchableOpacity
        disabled={isSubmitting}
        style={styles.saveButton}
        onPress={() => this.onSubmit()}>
        {isSubmitting ? (
          <ActivityIndicator
            color={config.color.common.white}
            size={config.fontSize.xlarge}
          />
        ) : (
          <Text style={styles.saveButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
    );
  };
  _renderRandomButton = () => {
    const {isGenerating} = this.state;

    return (
      <TouchableOpacity
        disabled={isGenerating}
        style={[styles.saveButton, {marginTop: scale(5)}]}
        onPress={() => this.generate()}>
        {isGenerating ? (
          <ActivityIndicator
            color={config.color.common.white}
            size={config.fontSize.xlarge}
          />
        ) : (
          <Text style={styles.saveButtonText}>Generate Dummy Data</Text>
        )}
      </TouchableOpacity>
    );
  };


  generate = async () => {
      try{
          this.setState({isGenerating: true}, () => {
              const db = this.db();
              const doneGenerating = generateHazard(db);

              if(doneGenerating){
                  this.setState({isGenerating: false}, () => {
                      Alert.alert('Pemberitahuan', 'Berhasil generate dummy data');
                  });
              }else{
                  this.setState({isGenerating: false}, () => {
                      Alert.alert('Pemberitahuan', 'Gagal generate dummy data');
                  });
              }
          });
      }catch (e) {
          console.log(e)
      }
  };

    render() {
        const {
            judulHazard,
            detailLaporan,
            detailLokasi,
            lokasi,
            subLokasi,
        } = this.state;
        return (
            <>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor={config.color.background}
                />
                <View style={styles.mainContainer}>
                    <View style={styles.centeredContent}>
                        {myIcon}
                        <Text style={styles.text}>Hazard Form</Text>
                    </View>

                    <TextInput
                        placeholder={'Judul Hazard'}
                        onChangeText={text => this.onChangeText_judulHazard(text)}
                        value={judulHazard}
                    />
                    <TextInput
                        placeholder={'Detail Laporan'}
                        onChangeText={text => this.onChangeText_detailLaporan(text)}
                        value={detailLaporan}
                    />
                    <View style={styles.lokasi}>
                        <Text style={{flex: 1}}>Lokasi</Text>
                        <Picker
                            // mode={'dropdown'}
                            selectedValue={lokasi}
                            style={{flex: 3, height: 50}}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({lokasi: itemValue})
                            }>
                            <Picker.Item label="Lain-lain" value="Lain-lain"/>
                            <Picker.Item label="Neo SOHO" value="Neo SOHO"/>
                        </Picker>
                    </View>

                    <View style={styles.lokasi}>
                        <Text style={{flex: 1}}>Sub Lokasi</Text>
                        <Picker
                            selectedValue={subLokasi}
                            style={{flex: 3, height: 50}}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({subLokasi: itemValue})
                            }>
                            <Picker.Item label="Lain-lain" value="Lain-lain"/>
                            <Picker.Item label="Lantai 30" value="Lantai 30"/>
                            <Picker.Item label="Lobby" value="Lobby"/>
                        </Picker>
                    </View>

                    <TextInput
                        placeholder={'Detail Lokasi'}
                        onChangeText={text => this.onChangeText_detailLokasi(text)}
                        value={detailLokasi}
                    />

                    {this._renderSubmitButton()}
                    {this._renderRandomButton()}
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        display: 'flex',
        flex: 1,
        padding: scale(30),
        backgroundColor: config.color.background,
    },
    lokasi: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: scale(6),
    },
    centeredContent: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    text: {
        ...textStyles.main,
        fontSize: config.fontSize.xlarge,
        marginTop: scale(8),
        marginBottom: scale(32),
    },
    saveButton: {
        // borderRadius: scale(8),
        backgroundColor: config.color.common.darkRed,
        padding: scale(12),
        margin: scale(5),
        marginTop: scale(32),
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: config.fontSize.medium,
        textAlign: 'center',
    },
});
