export const GlobalVariable = Object.freeze({
  BASE_API_URL: 'http://208.17.192.85:6544/api/v2/',
  BASE_URL: 'http://208.17.192.85:6544',
  SETTINGS: {
    settings: {
      system: {
        refreshInterval: 10,
        scrollInterval: 10,
        displayMode: 0,
        flightDisplay: 0,
        showTransit: true,
        showTransitType: 1,
        showExpectedDelivery: true,
        dropDelivered: true
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
        tableRowColor1: '#f00',
        tableRowColor2: '#00325d',
        businessName: 'Your Business Name Here'
      }
    }
  }
});
