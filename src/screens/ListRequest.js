import React, {Component} from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  StatusBar,
  FlatList,
  TouchableOpacity,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import config from '../config';
import endpoint from '../config/endpoint';
import scale from '../config/scale';
import {getDate, getTime} from '../utils/DateFormat';
import * as screenName from '../router/screenNames';

export default class ListRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listRequest: [],
      isFetching: false,
    };
  }

  fetchListRequest = async () => {
    const listRequest = await fetch(config.api + endpoint.getAllData)
      .then(response => {
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

    this.setState({listRequest, isFetching: false});

    return listRequest;
  };

  refresh = () => {
    this.setState({isFetching: true}, () => {
      this.fetchListRequest();
    });
  };

  componentDidMount() {
    this.refresh();
  }

  goToDetail = detail => {
    this.props.navigation.navigate(screenName.DETAIL_REQUEST_SCREEN, {
      detail,
    });
  };

  _renderList = item => {
    try {
      return (
        <TouchableOpacity
          onPress={() => this.goToDetail(item)}
          style={styles.listRequest}>
          <View style={styles.iconListRequest}>
            <Icon
              name={'hazard-lights'}
              size={scale(23)}
              color={config.color.common.darkRed}
            />
          </View>
          <View style={styles.descListRequest}>
            <Text>{item.judulRequest}</Text>
            <Text>{item.tipeRequest}</Text>
          </View>
          <View style={styles.timeListRequest}>
            <Text style={styles.time}>{getDate(item.createdAt)}</Text>
            <Text style={styles.time}>{getTime(item.createdAt)}</Text>
          </View>
        </TouchableOpacity>
      );
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  render() {
    const {listRequest, isFetching} = this.state;

    return (
      <>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={config.color.background}
        />
        <View style={styles.mainContainer}>
        <FlatList
            data={listRequest}
            renderItem={({item}) => this._renderList(item)}
            keyExtractor={item => item._id}
            onRefresh={() => this.refresh()}
            refreshing={isFetching}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    padding: scale(5),
    backgroundColor: config.color.background,
  },
  listRequest: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: scale(40),
    borderWidth: 1,
    borderRadius: 2,
    borderColor: config.color.gray,
    marginBottom: scale(5),
  },
  iconListRequest: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    height: scale(40),
    maxHeight: scale(40),
  },
  descListRequest: {
    flex: 4,
    height: scale(40),
    maxHeight: scale(40),
    paddingLeft: scale(8),
    justifyContent: 'center',
  },
  timeListRequest: {
    flex: 1,
    height: scale(40),
    maxHeight: scale(40),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: scale(5),
    paddingBottom: scale(3),
  },
  time: {
    fontSize: config.fontSize.mini,
    color: config.color.common.gray,
  },
});
