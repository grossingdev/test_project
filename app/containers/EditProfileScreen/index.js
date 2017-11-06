import React, { Component } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, Keyboard, ActivityIndicator } from 'react-native';
import I18n from 'react-native-i18n';
import { debounce, map } from 'lodash';
import { connect } from 'react-redux';
import { CachedImage } from 'react-native-cached-image';
import AppContainer from '../AppContainer';
import { firebaseStorage } from '../../firebase';
import { DrinkupActions, AuthActions } from '../../redux';
import { Button, PicPhotoSourceDialog, NavItems } from '../../components';
import { openPicker } from '../../utils/photoUtils';
import { Colors, DrinkIcons } from '../../themes';
import Styles from './styles';

const avatar = require('../../images/avatar-dark.png');

class EditProfileScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: props.user.firstName,
      image: props.user.photoURL ? { uri: props.user.photoURL } : avatar,
      icon: props.user.icon,
      showPicDialog: false,
      photoURL: props.user.photoURL,
      imageUploading: false,
    };
    this.state.isProfileComplete = this.checkProfileStatus(this.state.icon, this.state.firstName, this.state.photoURL);
  }
  checkProfileStatus(icon, firstName, photoURL) {
    if (!firstName || firstName.length === 0) {
      return false;
    }
    if (!icon || !photoURL) {
      return false;
    }
    return true;
  }
  onFirstNameChange = e => {
    const isProfileComplete = this.checkProfileStatus(this.state.icon, e.nativeEvent.text, this.state.photoURL);
    this.setState({ firstName: e.nativeEvent.text, isProfileComplete });
  };
  onSelectIcon = icon => {
    const isProfileComplete = this.checkProfileStatus(icon, this.state.firstName, this.state.photoURL);
    this.setState({ icon, isProfileComplete });
  };
  onImageSelected = async (photo) => {
    this.setState({ image: { uri: photo.path }, imageUploading: true, isProfileComplete : false });
    let photoURL = '';
    try {
      const filename = photo.path.replace(/^.*[\\/]/, '');
      const storageRef = firebaseStorage.ref(`photos/${this.props.uid}/${filename}`);
      const storageOpts = { contentType: 'image/jpeg', contentEncoding: 'base64' };
      const res = await storageRef.put(photo.path, storageOpts);
      photoURL = res.downloadURL;
    } catch (err) {
      console.log('err', err);
    }
    const isProfileComplete = this.checkProfileStatus(this.state.icon, this.state.firstName, photoURL);
    this.setState({ photoURL, imageUploading: false, isProfileComplete });
  };
  doShowPicDialog = () =>
    openPicker({ width: 512, height: 512, cropping: true })
      .then(this.onImageSelected);
  saveProfile = () => {
    const { icon, firstName, photoURL } = this.state;
    const { routeName } = this.props.navigation.state;
    this.props.updateProfile({ firstName, icon, photoURL });
    Keyboard.dismiss();
    if (routeName === 'CompleteProfileScene') {
      this.completeProfile();
    }
  };
  completeProfile = () => {
    const { user, uid, navigation } = this.props;
    const { icon, firstName, photoURL } = this.state;
    const { params } = navigation.state;
    const currentUser = { ...user, uid, icon, firstName, photoURL };
    if (params.type === 'Join') {
      this.props.sendRequestDrinkup(params.bar, currentUser);
      navigation.goBack();
    } else if (params.type === 'Start') {
      this.props.startDrinkup(params.barId, currentUser);
    }
  };

  render() {
    const { navigation, fetching } = this.props;
    const { routeName } = this.props.navigation.state;
    const { firstName, showPicDialog, isProfileComplete, imageUploading } = this.state;
    const opacity = imageUploading ? 0.3 : 1.0;
    return (
      <AppContainer
        title={routeName !== 'CompleteProfileScene' ? 'Edit Profile' : 'Complete Profile'}
        renderLeftButton={routeName !== 'CompleteProfileScene' ? NavItems.hamburgerButton(navigation) : NavItems.backButton(navigation)}
      >
        <View style={Styles.mainContainer}>
          <View style={Styles.formContainer}>
            <View style={Styles.selectPhotoContainer}>
              <TouchableOpacity activeOpacity={0.7} onPress={this.doShowPicDialog}>
                <View style={[Styles.photoContainer, { opacity }]}>
                  <CachedImage source={this.state.image} style={Styles.photo} />
                </View>
                <View style={Styles.waitingContainer}>
                  <ActivityIndicator size="large" animating={imageUploading} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={this.doChoosePhoto}>
                <Text style={Styles.updatePhoto}>{I18n.t('Profile_TapToAddPhoto').toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
            <View style={[Styles.labelContainer, { borderBottomWidth: 1 }]}>
              <Text style={Styles.label}>{I18n.t('Profile_FirstName')}</Text>
              <TextInput
                style={Styles.input}
                value={firstName}
                autoCorrect={false}
                maxLength={15}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                onChange={this.onFirstNameChange}
                underlineColorAndroid={Colors.transparent}
                selectionColor={Colors.brand.clear.orange}
              />
            </View>
            <View style={Styles.spacer} />
            <View style={Styles.labelContainer}>
              <Text style={Styles.label}>{I18n.t('Profile_FavoriteDrink')}</Text>
            </View>
            <View style={Styles.iconContainer}>
              {map(DrinkIcons, (img, icon) => (
                <TouchableOpacity
                  key={icon}
                  activeOpacity={0.7}
                  onPress={() => this.onSelectIcon(icon)}
                  style={Styles.iconButton}
                >
                  <Image
                    source={img}
                    style={[Styles.drinkIcon, {
                      width: 64,
                      height: 64,
                      opacity: icon === this.state.icon ? 1.0 : 0.4,
                    }]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={Styles.footer}>
              <Button
                showIndicator={fetching}
                theme={!isProfileComplete ? 'disallow' : 'primary'}
                clickable={isProfileComplete}
                text="Save profile"
                onPress={this.saveProfile}
              />
            </View>
            {(routeName !== 'EditProfileScreen' && !isProfileComplete) &&
            <View style={Styles.footer}>
              <Text style={Styles.incompleteProfileText}>{I18n.t('Profile_IncompleteWarning')}</Text>
            </View>
            }
          </View>
          {showPicDialog &&
            <PicPhotoSourceDialog
              visible={showPicDialog}
              onClose={() => this.setState({ showPicDialog: false })}
              onUsePhotosPress={this.doSelectPhoto('Picker')}
              onUseCameraPress={this.doSelectPhoto('Camera')}
            />
          }
        </View>
      </AppContainer>
    );
  }
}

const mapStateToProps = state => ({
  fetching: state.auth.fetching,
  user: state.auth.profile,
  uid: state.auth.uid,
});
const mapDispatchToProps = dispatch => ({
  startDrinkup: (barId, user) => dispatch(DrinkupActions.startDrinkup(barId, user)),
  sendRequestDrinkup: (bar, user) => dispatch(DrinkupActions.sendRequestDrinkup(bar, user)),
  updateProfile: diff => dispatch(AuthActions.updateProfile(diff)),
  uploadProfilePhoto: photo => dispatch(AuthActions.uploadProfilePhoto(photo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
