import { map } from 'lodash';
import { getDistance } from 'geolib';
import { EventFactory } from '../../firebase/models';
import { geoFire } from '../../firebase';
import { download } from '../../utils/downloadUtils';

const barGeoFire = geoFire('barLocations');
class EventInformation {
  constructor() {
    this.events = {
    };
    this.eventActions = {
      onAdd: this.onAdd,
      onRemove: this.onRemove,
    };
    this.eventModel = new EventFactory(this.eventActions);
    this.eventModel.subscribe(() => {}, null);
    this.callback = null;
  }
  onAdd = async (data) => {
    const eventId = Object.keys(data)[0];
    const event = data[eventId];
    if (event.barId) {
      const barLocation = await barGeoFire.get(event.barId);
      this.onEventEntered(eventId, barLocation);
      console.log('onAdd', eventId, data[eventId], barLocation);
    }
  };
  onRemove = (data) => {
    const eventId = Object.keys(data)[0];
    delete this.events[eventId];
    if (this.callback) {
      this.callback();
    }
    console.log('onRemove', eventId, data[eventId]);
  };
  onEventEntered = async (eventId, location) => {
    this.events[eventId] = await this.eventModel.get(eventId, true);
    const contentUrl = this.events[eventId].content_url;
    this.events[eventId].content = await download(contentUrl);
    this.events[eventId].location = location;
    if (this.callback) {
      this.callback();
    }
  };
  setCallback = callback => this.callback = callback;
  checkEventStatus = (barId) => {
    let ret = false;
    map(this.events, (event) => {
      if (event.barId === barId) {
        ret = true;
      }
    });
    return ret;
  };
  getEvent = (position) => {
    let ret = null;
    let retDistance = -1;
    map(this.events, (event) => {
      const distance = getDistance(position, event.location);
      if (retDistance === -1 || distance < retDistance) {
        retDistance = distance;
        ret = event;
      }
    });
    return ret;
  };
}
export const EventsInformation = new EventInformation();

