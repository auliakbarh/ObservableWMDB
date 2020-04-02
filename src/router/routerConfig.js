import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';

import SimpleApp from './bottomTabNavigator';

function RouterApp(props) {
  return (
    <NavigationContainer>
      <SimpleApp />
    </NavigationContainer>
  );
}

export default RouterApp;
