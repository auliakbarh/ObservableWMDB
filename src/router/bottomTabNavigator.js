import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import config from '../config';

/**
 * Screen
 */

import * as screenName from './screenNames';
import RequestTab from '../screens/RequestForm';
import RequestHazard from '../screens/HazardForm';
import {SubmittedReportStackNavigator, SubmittedReportStackNavigatorDraft, SubmittedHazardStackNavigator} from './stackNavigator';

import database from '../model/database';
import ListHazard from "../screens/ListHazard";
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={screenName.REPORT_TAB}
      backBehavior={'none'}
      screenOptions={({route}) => {
        let tabBarVisible = true;
        return {
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            switch (route.name) {
              case screenName.REPORT_TAB:
                iconName = 'file-document-edit-outline';
                break;
              case screenName.LIST_REPORT:
                iconName = 'format-list-bulleted-type';
                break;
              case screenName.LIST_DRAFT:
                iconName = 'format-list-bulleted-type';
                break;
              case screenName.HAZARD_TAB:
                iconName = 'format-list-bulleted-type';
                break;
              case screenName.LIST_HAZARD:
                iconName = 'format-list-bulleted-type';
                break;
              default:
                iconName = null;
                break;
            }

            const sizeValue = focused ? size + 3 : size;

            return (
              // <Image
              //   source={iconName}
              //   style={{width: sizeValue, height: sizeValue}}
              //   tintColor={color}
              // />
              <Icon
              name={iconName}
              size={sizeValue}
              color={color}
              />
            );
          },
          tabBarLabel: ({focused, color}) => {
            let tabName;
            // switch (route.name) {
            //   case screenName.REPORT_TAB:
            //     tabName = 'Request';
            //     break;
            //   case screenName.LIST_REPORT:
            //     tabName = 'My Submitted Request';
            //     break;
            //   case screenName.LIST_REPORT:
            //     tabName = 'TEST';
            //     break;
            //   default:
            //     tabName = '';
            //     break;
            // }

            return (
              <Text
                style={{
                  color,
                  fontSize: config.fontSize.small,
                  fontWeight: focused ? 'bold' : 'normal',
                }}>
                {tabName}
              </Text>
            );
          },
          tabBarVisible,
          tabBarButton: props => <TouchableOpacity {...props} />,
        };
      }}
      tabBarOptions={{
        activeTintColor: 'white',
        inactiveTintColor: 'white',
        style: {
          backgroundColor: config.color.common.darkRed,
        },
      }}>
      <Tab.Screen
          // component={RequestTab}
          name={screenName.REPORT_TAB} >
          {function ({navigation, route}) {
              return <RequestTab
                  database={database}
                  navigation={navigation}
                  route={route}
              />
          }}
      </Tab.Screen>
      <Tab.Screen name={screenName.LIST_REPORT} component={SubmittedReportStackNavigator} />
      <Tab.Screen name={screenName.LIST_DRAFT} component={SubmittedReportStackNavigatorDraft} />
      <Tab.Screen name={screenName.HAZARD_TAB} component={RequestHazard} />
      <Tab.Screen
          // component={SubmittedHazardStackNavigator}
          name={screenName.LIST_HAZARD}  >
          {function ({navigation, route}) {
              return <SubmittedHazardStackNavigator
                  database={database}
                  navigation={navigation}
                  route={route}
              />
          }}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
