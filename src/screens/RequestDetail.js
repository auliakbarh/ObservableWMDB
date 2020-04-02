import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import scale from '../config/scale';
import config from '../config';
import {getTime, getDate} from '../utils/DateFormat';

class RequestDetail extends Component {
  constructor(props) {
    super(props);

    let initialState = {
      createdAt: '',
      _id: '',
      judulRequest : '',
      tipeRequest : '',
      alasan : '',
    };

    try {
      const {
        createdAt,
        _id,
        judulRequest,
        tipeRequest,
        alasan,
      } = this.props.route.params.detail;

      initialState = {
        createdAt,
        _id,
        judulRequest,
        tipeRequest,
        alasan,
      };
    } catch (e) {
      console.log(e);
    }

    this.state = {...initialState};
  }

  render() {
    const {createdAt, judulRequest, tipeRequest, alasan} = this.state;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Waktu:</Text>
          <Text style={styles.detail}>
            {`${getDate(createdAt, true)} ${getTime(createdAt,)}`}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Judul:</Text>
          <Text style={styles.detail}>{judulRequest}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Tipe:</Text>
          <Text style={styles.detail}>{tipeRequest}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Alasan:</Text>
          <Text style={styles.detail}>{alasan}</Text>
        </View>
      </View>
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
  detailItem: {
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    flex: 1,
    marginRight: scale(5),
    fontWeight: 'bold',
    // backgroundColor: 'green',
  },
  detail: {
    flex: 2,
    // backgroundColor: 'blue',
  },
});

export default RequestDetail;
