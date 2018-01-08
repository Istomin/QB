import { FontSizeSetting } from '../models/fontSizeSetting';

export const GlobalVariable = Object.freeze({
  BASE_API_URL: 'http://board.quick.aero/api/v2/',
  BASE_URL: 'http://board.quick.aero',
  SETTINGS: {
    settings: {
      system: {
        refreshInterval: 10,
        scrollInterval: 10,
        displayShipper: true,
        displayConsignee: true,
        flightDisplay: 0,
        showTransit: true,
        showTransitType: 1,
        showExpectedDelivery: true,
        dropDelivered: true,
        numberOfSigns: 15
      },
      alerts: {
        primaryInTransit: true,
        primaryInTransitTime: 25,
        primaryInTransitTextColor: '#fff',
        primaryInTransitBackgroundColor: '#f00',
        secondaryInTransit: true,
        secondaryInTransitTime: 25,
        secondaryInTransitTextColor: '#fff',
        secondaryInTransitBackgroundColor: '#000',
        etaNote: true,
        etaNoteType: 1,
        etaNoteTextColor: '#fff',
        etaNoteBackgroundColor: '#63b821',
      },
      graphics: {
        titleBackground: '#555',
        titleTextColor: '#fff',
        tableHeaderColor: '#016c8f',
        tableTextColor: '#fff',
        tableRowColor1: '#064778',
        tableRowColor2: '#00325d',
        businessName: 'Your Business Name Here'
      },
      fontSizes: {
        tBodyTd: new FontSizeSetting(10, 22, 18),
        tHeadTh: new FontSizeSetting(10, 22, 18),
        runTextHolder: new FontSizeSetting(14, 30, 21),
        headerClock: new FontSizeSetting(14, 30, 22),
        headerLogo: new FontSizeSetting(14, 30, 22),
      }
    }
  }
});
