import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

import scale from '../config/scale';
import config from '../config';

const TextInputComponent = props => {
  const [value, onChangeText] = React.useState(props.value ? props.value : '');

  const [isFocused, setFocus] = React.useState(false);

  const handleFocus = event => {
    setFocus(true);
    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  const handleBlur = event => {
    setFocus(false);
    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  return (
    <>
      <TextInput
        style={styles.textInput}
        {...props}
        onChangeText={text =>
          props.onChangeText ? props.onChangeText(text) : onChangeText(text)
        }
        value={props.value ? props.value : value}
        placeholder={props.placeholder ? props.placeholder : 'Input text here'}
        selectionColor={config.color.blue}
        underlineColorAndroid={
          isFocused ? config.color.blue : config.color.gray
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: scale(40),
    paddingLeft: scale(6),
  },
});

export default TextInputComponent;
