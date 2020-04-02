import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import withObservables from '@nozbe/with-observables';

import config from '../config';
import endpoint from '../config/endpoint';
import scale from '../config/scale';
import {getDate, getTime} from '../utils/DateFormat';
import * as screenName from '../router/screenNames';
import database from '../model/database';

export default class ListRequest extends Component {
  constructor(props) {
    super(props);
    // this.handleChange = this.handleChange.bind(this);
    this.state = {
      listRequest: [],
      isFetching: false,
    };
  }


  fetchListRequest = async () => {
    try {
      const postsCollection = database.collections.get('requests');
      const allPosts = await postsCollection.query().fetch();
      this.setState({listRequest: allPosts, isFetching: false});
      return postsCollection;
    } catch (e) {
      console.log(e, 'juju');
    }
  };

  refresh = () => {
    this.setState({isFetching: true}, () => {
      this.fetchListRequest();
    });
  };

  componentDidMount() {
    this.refresh();
  }

  goToDetail = async detail => {
    try{
      await database.action(async () => {
        const postsCollection = database.collections.get('requests');
        const data = await postsCollection.find(detail.id)
        await data.update(post => {
          post.judulRequest = 'Updated title'
        })
      })
    }catch(e){
      console.log(e)
    }
  };

  _renderList = item => {
    const Request = ({requests}) => (
      <TouchableOpacity
        onPress={() => this.goToDetail(requests)}
        style={styles.listRequest}>
        <View style={styles.iconListRequest}>
          <Icon
            name={'hazard-lights'}
            size={scale(23)}
            color={config.color.common.darkRed}
          />
        </View>
        <View style={styles.descListRequest}>
          <Text>{requests.judulRequest}</Text>
          <Text>{requests.tipeRequest}</Text>
        </View>
        <View style={styles.timeListRequest}>
          <Text style={styles.time}>{getDate(requests.createdAt)}</Text>
          <Text style={styles.time}>{getTime(requests.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    );
    
    const enhance = withObservables(['requests'], ({requests}) => {
      console.log('req ==> ', requests.observe())
      return ({
        requests, // shortcut syntax for `comment: comment.observe()`
      })
    });
    const EnhancedRequest = enhance(Request);

    try {
      return <EnhancedRequest requests={item} />;
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
            keyExtractor={item => item.id}
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
