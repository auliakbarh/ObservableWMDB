import React, {Component} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import config from '../config';
import endpoint from '../config/endpoint';
import scale from '../config/scale';
import {getDate, getTime} from '../utils/DateFormat';
import * as screenName from '../router/screenNames';
import withObservables from '@nozbe/with-observables';
// import db from '../model/database';
import { Q } from "@nozbe/watermelondb";
// import database from "../model/database";

class ListHazard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listHazard: [],
      isFetching: false,
    };
    console.log('this.props', this.props)
  }

  fetchListHazardAPI = async () => {
    const listHazard = await fetch(config.api + endpoint.getAllData)
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

    this.setState({listHazard, isFetching: false});

    return listHazard;
  };

  fetchListHazard = async () => {
    const listHazard = await this.getHazards();

    this.setState({listHazard, isFetching: false});

    return listHazard;
  };

  refresh = () => {
    this.setState({isFetching: true}, () => {
      this.fetchListHazard();
    });
  };

  async componentDidMount() {
    this.refresh();
  }

  goToDetail = async detail => {

    // console.log('this.props.database', this.props.database)
    await this.props.database.action(async () => {
      try {
        /*
        console.log(detail)
        console.log(detail.id)
        const findHazard = await hazardsCollection.query(Q.where('id',detail.id));
        console.log('findHazard', findHazard)
        */

        // await detail.update(hazard => {
        //   hazard.judulHazard = 'Updated Hazard Title When go To Detail (Hard coded)';
        // });

        await detail.markAsDeleted() // syncable
        await detail.destroyPermanently() // permanent

      }catch (e) {
        console.log(e)
      }
    });

    // this.props.navigation.navigate(screenName.DETAIL_HAZARD_SCREEN, {
    //   detail,
    // });
  };



  _renderList = item => (
    <EnhancedHazardItem database={this.props.database} hazards={item.item} onPress={this.goToDetail} />
  );

  db = () => {
    let database = null;
    try {
      database = this.props.database;
    } catch (e) {
      console.log(e);
    }
    return database;
  };

  getHazards = async () => {
    // const db = this.db();
    const hazardsCollection = this.props.database.collections.get('hazards');
    console.log('hazardsCollection', hazardsCollection);
    const listHazard = await hazardsCollection.query().fetch();
    console.log('listHazard =>', listHazard);
    return listHazard;
  };

  render() {
    const {listHazard, isFetching} = this.state;
    console.log('this.props.listHazard', this.props.listHazard)

    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={config.color.common.darkRed}
        />
        <View style={styles.mainContainer}>
          <FlatList
            data={this.props.listHazard}
            renderItem={item => this._renderList(item)}
            keyExtractor={item => item.id}
            onRefresh={() => this.refresh()}
            refreshing={isFetching}
          />
          {/*<EnhancedFL database={db} renderList={this._renderList} onRefresh={this.refresh} isFetching={isFetching} />*/}
        </View>
      </>
    );
  }
}

const MyFlatlist = ({data, renderList, onRefresh, isFetching}) => {
  return (
    <FlatList
      data={data}
      renderItem={item => renderList(item)}
      keyExtractor={item => item.id}
      onRefresh={() => onRefresh()}
      refreshing={isFetching}
    />
  );
};

const enhanceMFL = withObservables(['database'], ({database}) => {
  // console.log('the data ==> ', database);
  console.log('database has changed')
  const query = database.collections.get('hazards').query(Q.where('judulHazard', Q.notEq(null)));
  // const result = query.fetch().then(arr => console.log('ARRRR', arr));
  // console.log('resulte', result)
  // console.log('listhz kosong', database.collections.get('hazards').query(Q.where('judulHazard', Q.notEq(null))).fetch())
  return {
    listHazard: query, // shortcut syntax for `comment: comment.observe()`
  };
});

const EnhancedComponent = enhanceMFL(ListHazard);

const HazardItem = ({hazards, onPress}) => (
  <TouchableOpacity onPress={() => onPress(hazards)} style={styles.listHazard}>
    <View style={styles.iconListHazard}>
      <Icon
        name={'hazard-lights'}
        size={scale(23)}
        color={config.color.common.darkRed}
      />
    </View>
    <View style={styles.descListHazard}>
      <Text>{hazards.judulHazard}</Text>
      <Text>{`${hazards.lokasi} - ${hazards.subLokasi}`}</Text>
    </View>
    <View style={styles.timeListHazard}>
      <Text style={styles.time}>{getDate(hazards.waktuLaporan)}</Text>
      <Text style={styles.time}>{getTime(hazards.waktuLaporan)}</Text>
    </View>
  </TouchableOpacity>
);

const enhancef = withObservables(['hazards', 'database'], ({hazards, database}) => {
  console.log('db ==> ', database)
  console.log('req ==> ', hazards);
  return {
    hazards, // shortcut syntax for `comment: comment.observe()`
  };
});

const EnhancedHazardItem = enhancef(HazardItem);

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flex: 1,
    padding: scale(5),
    backgroundColor: config.color.background,
  },
  listHazard: {
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
  iconListHazard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    height: scale(40),
    maxHeight: scale(40),
  },
  descListHazard: {
    flex: 4,
    height: scale(40),
    maxHeight: scale(40),
    paddingLeft: scale(8),
    justifyContent: 'center',
  },
  timeListHazard: {
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

// export default ListHazard;
export default EnhancedComponent;
