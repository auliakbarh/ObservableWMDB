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

import config from '../config';
import endpoint from '../config/endpoint';
import scale from '../config/scale';
import {textStyles} from '../config/styles';
import TextInput from '../components/TextInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '../model/database';
import {synchronize} from '@nozbe/watermelondb/sync';
import { date } from '@nozbe/watermelondb/decorators';

const initialState = {
  judulRequest: '',
  tipeRequest: 'Perizinan',
  alasan: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isSubmitting: false,
  isDrafting: false,
  isSuccess: false,
};

export default class RequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {...initialState};
  }

  onChangeText_judulRequest = text => {
    this.setState({judulRequest: text});
  };

  onChangeText_alasan = text => {
    this.setState({alasan: text});
  };

  //SUBMIT DRAFT
  submitToDraft = async () => {
    const {judulRequest, tipeRequest, alasan, createdAt, updatedAt} = this.state;

    const data = {
      judulRequest,
      tipeRequest,
      alasan,
      createdAt,
      updatedAt,
    };

    try {
      const postsCollection = database.collections.get('requests');
      console.log(data)
      await database.action(async () => {
        const newPost = await postsCollection.create(post => {
          post.judulRequest = data.judulRequest;
          post.tipeRequest = data.tipeRequest;
          post.alasan = data.alasan;
          post.createdAt = Date.now();
          post.updatedAt = Date.now();
        });
        if (newPost) {
          console.log('Success');
          this.setState({
            ...initialState,
            isDrafting: false,
            isSuccess: true,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  onSubmitDraft = () => {
    this.setState({isDrafting: true}, () => this.submitToDraft());
  };

  _renderSubmitDraft = () => {
    const {isDrafting} = this.state;

    return (
      <TouchableOpacity
        disabled={isDrafting}
        style={styles.saveButton}
        onPress={() => this.onSubmitDraft()}>
        {isDrafting ? (
          <ActivityIndicator
            color={config.color.common.white}
            size={config.fontSize.xlarge}
          />
        ) : (
          <Text style={styles.saveButtonText}>Save To Draft</Text>
        )}
      </TouchableOpacity>
    );
  };

  //SYNC
  onSync = async () => {
    await synchronize({
      database,
      pullChanges: async ({lastPulledAt}) => {
        let firstPull = 0
        if(!lastPulledAt){
          lastPulledAt = 1577883661
          firstPull = 1
        }

        const listRequest = await fetch(`${config.api}ablSync?updatedAt=${lastPulledAt}&firstPull=${firstPull}`,)
          .then(response => {
            console.log(response)
            return response.json();
          })
          .then(data => {
            if (data.status === 200) {
              return data.data;
            } else {
              return [];
            }
          })
          .catch(e => {
            console.warn(e);
            return [];
          });
          const {changes, timestamp} = listRequest;
        return {changes, timestamp};
      },

      pushChanges: async ({changes, lastPulledAt}) => {

        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };
        const response = await fetch(`${config.api}ablSync?updatedAt=${lastPulledAt}`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(changes),
            timeout: 500,
          },
        );
        console.log(changes, 'ini changes')
        // console.log(response, 'ini changes')
        if (!response.ok) {
          console.log('errrorrrrr')
          throw new Error(await response.text());
        }
      },
    });
  };

  _renderSync = () => {
    const {isDrafting} = this.state;

    return (
      <TouchableOpacity
        disabled={isDrafting}
        style={styles.saveButton}
        onPress={() => this.onSync()}>
        <Text style={styles.saveButtonText}>SYNC</Text>
      </TouchableOpacity>
    );
  };

  //Reset
  onReset = async () => {
    await this.props.database.action(async () => {
        await database.unsafeResetDatabase()
      })
  };

  _renderReset = () => {
    const {isDrafting} = this.state;

    return (
      <TouchableOpacity
        disabled={isDrafting}
        style={styles.saveButton}
        onPress={() => this.onReset()}>
        <Text style={styles.saveButtonText}>Reset DB</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {judulRequest, tipeRequest, alasan} = this.state;
    return (
      <>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={config.color.background}
        />
        <View style={styles.mainContainer}>
          <View style={styles.centeredContent}>
            <Icon name="rocket" size={50} color={config.color.common.darkRed} />
            <Text style={styles.text}>Request Form</Text>
          </View>

          <TextInput
            placeholder={'Judul Request'}
            onChangeText={text => this.onChangeText_judulRequest(text)}
            value={judulRequest}
          />

          <View style={styles.lokasi}>
            <Text style={{flex: 1}}>Tipe Request</Text>
            <Picker
              // mode={'dropdown'}
              selectedValue={tipeRequest}
              style={{flex: 3, height: 50}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({tipeRequest: itemValue})
              }>
              <Picker.Item label="Perizinan" value="Perizinan" />
              <Picker.Item label="Pengajuan" value="Pengajuan" />
              <Picker.Item label="Lain-lain" value="Lain-lain" />
            </Picker>
          </View>

          <TextInput
            placeholder={'Alasan'}
            onChangeText={text => this.onChangeText_alasan(text)}
            value={alasan}
          />

          {/* {this._renderSubmitButton()} */}
          {this._renderSubmitDraft()}
          {this._renderSync()}
          {this._renderReset()}
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
    // borderRadius: scale(16),
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
