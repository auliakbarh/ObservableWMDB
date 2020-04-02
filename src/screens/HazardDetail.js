import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import scale from '../config/scale';
import config from '../config';
import {getTime, getDate} from '../utils/DateFormat';

class HazardDetail extends Component {
  constructor(props) {
    super(props);

    let initialState = {
      createdAt: '',
      _id: '',
      waktuLaporan: '',
      judulHazard: '',
      detailLaporan: '',
      lokasi: '',
      subLokasi: '',
      detailLokasi: '',
    };

    try {
      const {
        createdAt,
        _id,
        waktuLaporan,
        judulHazard,
        detailLaporan,
        lokasi,
        subLokasi,
        detailLokasi,
      } = this.props.route.params.detail;

      initialState = {
        createdAt,
        _id,
        waktuLaporan,
        judulHazard,
        detailLaporan,
        lokasi,
        subLokasi,
        detailLokasi,
      };
    } catch (e) {
      console.log(e);
    }

    this.state = {...initialState};
  }

  render() {
    const {
      waktuLaporan,
      judulHazard,
      detailLaporan,
      lokasi,
      subLokasi,
      detailLokasi,
    } = this.state;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Waktu:</Text>
          <Text style={styles.detail}>{`${getDate(waktuLaporan, true)} ${getTime(waktuLaporan)}`}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Judul:</Text>
          <Text style={styles.detail}>{judulHazard}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Detail Laporan:</Text>
          <Text style={styles.detail}>{detailLaporan}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Lokasi:</Text>
          <Text style={styles.detail}>{lokasi}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Sub Lokasi:</Text>
          <Text style={styles.detail}>{subLokasi}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Detail Lokasi:</Text>
          <Text style={styles.detail}>{detailLokasi}</Text>
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

export default HazardDetail;
