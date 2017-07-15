import { all, takeEvery, takeLatest } from 'redux-saga/effects';

import { AlertTypes } from '../alert';
import { BarTypes } from '../bar';
import { DrinkupTypes } from '../drinkup';
import { AuthTypes } from '../auth';
import { LocationTypes } from '../location';
import { StartupTypes } from '../startup';
import { OpenScreenTypes } from '../openScreen';

/* ------------- Sagas ------------- */
import {
  signIn,
  signOut,
  signOutSuccess,
  getOrCreateProfile,
  createProfile,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from './auth';

import { getDrinkup, getBar, startDrinkUp } from './drinkup';
import { getBars, addBar } from './bar';
import { startBackgroundGeolocation, startBackgroundGeolocationWatchers } from './location';
import { getAlerts } from './alert';
import { startup } from './startup';
import { openScreen } from './openScreen';

/* ------------- API ------------- */
// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = DebugSettings.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(AuthTypes.SIGN_IN, signIn),
    takeLatest(AuthTypes.SIGN_OUT, signOut),
    takeLatest(AuthTypes.SIGN_IN_FULFILLED, getOrCreateProfile),
    takeLatest(AuthTypes.SIGN_OUT_FULFILLED, signOutSuccess),
    takeLatest(AuthTypes.GET_PROFILE, getProfile),
    takeLatest(AuthTypes.CREATE_PROFILE, createProfile),
    takeLatest(AuthTypes.UPLOAD_PROFILE_PHOTO, uploadProfilePhoto),
    takeEvery(AuthTypes.UPDATE_PROFILE, updateProfile),
    takeLatest(LocationTypes.START_BACKGROUND_GEOLOCATION, startBackgroundGeolocation),
    takeLatest(LocationTypes.START_BACKGROUND_GEOLOCATION_SUCCESS, startBackgroundGeolocationWatchers),
    takeEvery(BarTypes.ADD_BAR, addBar),
    takeLatest(BarTypes.BARS_REQUEST, getBars),
    takeLatest(DrinkupTypes.BAR_REQUEST, getBar),
    takeLatest(DrinkupTypes.DRINKUP_REQUEST, getDrinkup),
    takeLatest(DrinkupTypes.START_DRINKUP, startDrinkUp),
    takeLatest(OpenScreenTypes.OPEN_SCREEN, openScreen),
    takeLatest(AlertTypes.ALERTS_REQUEST, getAlerts),
  ]);
}
