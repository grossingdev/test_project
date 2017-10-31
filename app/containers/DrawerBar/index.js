// @flow
import React, { Component } from 'react';
import { ScrollView, Image, View, Text, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import config from '../../config/appConfig';
import AppContainer from '../AppContainer';
import { Connect } from '../../redux';
import { DrawerButton } from '../../components';
import styles from './styles';
const avatar = require('../../images/avatar.png');

class DrawBar extends Component {

  static defaultProps = {
    profile: {
      name: '',
    },
  }

  onLogout = () => {
    this.props.actions.signOut(this.props.navigation);
  };

  navigateTo = page => () => this.props.navigation.navigate(page);
  render() {
    const { activeItemKey, auth: { profile }, joined } = this.props;
    return (
      <AppContainer hideNavBar>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {profile.photoURL ?
                <Image source={{ uri: profile.photoURL }} style={styles.avatar} /> :
                <Image source={avatar} style={styles.avatar} />
              }
            </View>
            <Text style={styles.name}>{profile.firstName}</Text>
          </View>
          <ScrollView style={styles.contentContainer}>
            {joined ? (
              <DrawerButton
                isActive={activeItemKey === 'DrinkUpScreen'}
                text={I18n.t('DRINK_UP')}
                onPress={this.navigateTo('DrinkUpScreen')}
                iconFamily="alko"
                iconName="mug"
              />
            ) : (
              <DrawerButton
                isActive={activeItemKey === 'MapScreen'}
                text={I18n.t('BARS')}
                onPress={this.navigateTo('MapScreen')}
              />
            )}

            <DrawerButton
              isActive={activeItemKey === 'EditProfileScreen'}
              text="MY PROFILE"
              onPress={this.navigateTo('EditProfileScreen')}
            />
            {
              /*
            <DrawerButton
              isActive={activeItemKey === 'PushNotificationsScreen'}
              text={I18n.t('PUSH_NOTIFICATIONS')}
              onPress={this.navigateTo('PushNotificationsScreen')}
            />
               */
            }
            <DrawerButton
              isActive={activeItemKey === 'FeedBackScreen'}
              text="IDEAS? FEEDBACK?"
              onPress={this.navigateTo('FeedBackScreen')}
            />

          </ScrollView>
          <View style={styles.footer}>
            <View style={styles.row}>
              <TouchableOpacity onPress={this.navigateTo('TermsOfServiceScreen')}>
                <Text style={styles.copyright}>TERMS OF SERVICE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.navigateTo('PrivacyPolicyScreen')}>
                <Text style={styles.copyright}>PRIVACY POLICY</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={this.onLogout}>
              <Text style={styles.copyright}>© ALKO LLC</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppContainer>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  joined: state.drinkup.joined,
});

export default Connect(DrawBar, mapStateToProps);
