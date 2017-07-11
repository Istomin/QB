export class Settings {
  settings: {
    system: {
      refreshInterval: number,
      scrollInterval: number,
      displayMode: number,
      flightDisplay: number,
      showTransit: boolean,
      showTransitType: number,
      showExpectedDelivery: boolean,
      dropDelivered: boolean
    },
    alerts: {
      primaryInTransit: boolean,
      primaryInTransitTime: number,
      primaryInTransitTextColor: string,
      primaryInTransitBackgroundColor: string,
      secondaryInTransit: boolean,
      secondaryInTransitTime: number,
      secondaryInTransitTextColor: string,
      secondaryInTransitBackgroundColor: string,
      etaNote: boolean,
      etaNoteType: number,
      etaNoteTextColor: string,
      etaNoteBackgroundColor: string,
    },
    graphics: {
      titleBackground: string,
      titleTextColor: string,
      tableHeaderColor: string,
      tableTextColor: string,
      tableRowColor1: string,
      tableRowColor2: string,
      businessName: string
    }
  }
}
