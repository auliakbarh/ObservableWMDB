import apiJSON from './api';
import normalize from './scale';

const api = apiJSON.urlHeroku;

const fontSize = {
  tabBar: normalize(9),
  mgmMenu: normalize(9),
  mini: normalize(10),
  small: normalize(12),
  medium: normalize(14),
  large: normalize(16),
  xlarge: normalize(18),
  xxlarge: normalize(24),
};

// color palette for app
const colorPalette = {
  blue: '#008FD0',
  red: '#FF3030',
  darkRed: '#900',
  white: '#FFFFFF',
  lightGrey: '#e0e0e0',
  gray: '#a0a0a0',
  black: '#000000',
  background: {
    light: '#FFFFFF',
    dark: '#333333',
  },
};

// color palette for font in app
const fontColorPalette = {
  solid: {
    lightTheme: '#333333',
    darkTheme: '#FFFFFF',
  },
  opacity: {
    7: {
      lightTheme: 'rgba(51, 51, 51, 0.7)',
      darkTheme: 'rgba(255, 255, 255, 0.7)',
    },
    4: {
      lightTheme: 'rgba(51, 51, 51, 0.4)',
      darkTheme: 'rgba(255, 255, 255, 0.4)',
    },
  },
  colored: {
    solid: {
      blue: '#008FD0',
      red: '#FF3030',
      gray: '#a0a0a0',
      lightGrey: '#e0e0e0',
      white: '#FFFFFF',
      black: '#000000',
    },
    opacity: {},
  },
};

/**
 * configuration of color of the app (grouped by theme)
 */
const colors = {
  lightTheme: {
    background: colorPalette.background.light,
  },
  darkTheme: {
    background: colorPalette.background.dark,
  },
  common: colorPalette,
};

/**
 * configuration of font color of the app (grouped by theme)
 */
const fontColors = {
  lightTheme: {
    main: fontColorPalette.solid.lightTheme,
  },
  darkTheme: {
    main: fontColorPalette.solid.darkTheme,
  },
  common: fontColorPalette.colored,
};

/**
 * exported
 * color and font color by theme
 */
let theme = 'light';
let color = {};
let fontColor = {};

if (theme === 'light') {
  color = {
    // themed colors
    background: colors.lightTheme.background,

    // common
    common: colors.common,
    blue: colors.common.blue,
    red: colors.common.red,
    gray: colors.common.gray,
  };

  fontColor = {
    // themed colors
    main: fontColors.lightTheme.main,

    // common
    common: fontColor.common,
    forBackgroundBlue: fontColors.common.solid.white,
  };
}

export default {
  api,
  fontSize,
  color,
  fontColor,
};
