import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconAlko from '../IconAlko';
import styles from './styles';
import { applyComponentTheme } from '../../utils/common';
import BannerTheme from './theme';

function getIconFamilyComponent(iconFamily) {
  let Icon = null;
  switch (iconFamily) {
    case 'material':
      Icon = IconMaterial;
      break;
    case 'fontawesome':
      Icon = IconFontAwesome;
      break;
    case 'alko':
      Icon = IconAlko;
      break;
    default:
      Icon = IconMaterial;
  }
  return Icon;
}
const Banner = (props) => {
  const theme = BannerTheme[props.theme];
  const {
    style, gradientColors, onPress, textStyle, iconColor, iconSize, iconName,
  } = applyComponentTheme(theme, props);
  const Icon = getIconFamilyComponent(props.iconFamily);
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <LinearGradient colors={gradientColors} style={[styles.btn, style]}>
        <View style={styles.body}>
          <Icon style={styles.icon} name={iconName} size={iconSize} color={iconColor} />
          <Text style={[styles.bodyText, textStyle]}>{props.text}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

Banner.defaultProps = {
  theme: 'info',
  iconFamily: 'alko',
  iconName: 'badge',
  iconSize: 20,
};
export default Banner;
