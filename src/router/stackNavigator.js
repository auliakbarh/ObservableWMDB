import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

/**
 * Screen
 */
import ListRequest from '../screens/ListRequest';
import RequestDetail from '../screens/RequestDetail';
import ListDraft from '../screens/ListDraft';
import ListHazard from '../screens/ListHazard';
import HazardDetail from '../screens/HazardDetail';
import * as screenName from './screenNames';

import config from '../config';

const Stack = createStackNavigator();

import database from '../model/database';

export function SubmittedReportStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={screenName.MY_SUBMITTED_REPORT_SCREEN}
      headerMode={'float'}
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: config.color.common.darkRed},
      }}>
      <Stack.Screen
        name={screenName.MY_SUBMITTED_REPORT_SCREEN}
        component={ListRequest}
      />
      <Stack.Screen
        name={screenName.DETAIL_REQUEST_SCREEN}
        component={RequestDetail}
      />
    </Stack.Navigator>
  );
}

export function SubmittedReportStackNavigatorDraft() {
  return (
    <Stack.Navigator
      initialRouteName={screenName.LIST_DRAFT}
      headerMode={'float'}
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: config.color.common.darkRed},
      }}>
      <Stack.Screen name={screenName.LIST_DRAFT} component={ListDraft} />
      <Stack.Screen
        name={screenName.DETAIL_REQUEST_SCREEN}
        component={RequestDetail}
      />
    </Stack.Navigator>
  );
}

export function SubmittedHazardStackNavigator(props) {
  return (
    <Stack.Navigator
      initialRouteName={screenName.LIST_HAZARD}
      headerMode={'float'}
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: config.color.common.darkRed},
      }}>
      <Stack.Screen
        name={screenName.LIST_HAZARD}
        // component={ListHazard}
      >
        {function({navigation, route}) {
          return (
            <ListHazard
              database={props.database}
              navigation={navigation}
              route={route}
            />
          );
        }}
      </Stack.Screen>
      <Stack.Screen
        name={screenName.DETAIL_HAZARD_SCREEN}
        component={HazardDetail}
      />
    </Stack.Navigator>
  );
}
