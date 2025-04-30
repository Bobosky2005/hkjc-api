export const horseQuery = `
fragment raceFragment on Race {
  id
  no
  status
  raceName_en
  raceName_ch
  postTime
  country_en
  country_ch
  distance
  wageringFieldSize
  go_en
  go_ch
  ratingType
  raceTrack {
    description_en
    description_ch
  }
  raceCourse {
    description_en
    description_ch
    displayCode
  }
  claCode
  raceClass_en
  raceClass_ch
  judgeSigns {
    value_en
  }
}

fragment racingBlockFragment on RaceMeeting {
  jpEsts: pmPools(
    oddsTypes: [WIN, PLA, TCE, TRI, FF, QTT, DT, TT, SixUP]
    filters: ["jackpot", "estimatedDividend"]
  ) {
    leg {
      number
      races
    }
    oddsType
    jackpot
    estimatedDividend
    mergedPoolId
  }
  poolInvs: pmPools(
    oddsTypes: [WIN, PLA, QIN, QPL, CWA, CWB, CWC, IWN, FCT, TCE, TRI, FF, QTT, DBL, TBL, DT, TT, SixUP]
  ) {
    id
    leg {
      races
    }
  }
  penetrometerReadings(filters: ["first"]) {
    reading
    readingTime
  }
  hammerReadings(filters: ["first"]) {
    reading
    readingTime
  }
  changeHistories(filters: ["top3"]) {
    type
    time
    raceNo
    runnerNo
    horseName_ch
    horseName_en
    jockeyName_ch
    jockeyName_en
    scratchHorseName_ch
    scratchHorseName_en
    handicapWeight
    scrResvIndicator
  }
}

query raceMeetings($date: String, $venueCode: String) {
  timeOffset {
    rc
  }
  activeMeetings: raceMeetings {
    id
    venueCode
    date
    status
    races {
      no
      postTime
      status
      wageringFieldSize
    }
  }
  raceMeetings(date: $date, venueCode: $venueCode) {
    id
    status
    venueCode
    date
    totalNumberOfRace
    currentNumberOfRace
    dateOfWeek
    meetingType
    totalInvestment
    country {
      code
      namech
      nameen
      seq
    }
    races {
      ...raceFragment
      runners {
        id
        no
        standbyNo
        status
        name_ch
        name_en
        horse {
          id
          code
        }
        color
        barrierDrawNumber
        handicapWeight
        currentWeight
        currentRating
        internationalRating
        gearInfo
        racingColorFileName
        allowance
        trainerPreference
        last6run
        saddleClothNo
        trumpCard
        priority
        finalPosition
        deadHeat
        winOdds
        jockey {
          code
          name_en
          name_ch
        }
        trainer {
          code
          name_en
          name_ch
        }
      }
    }
    obSt: pmPools(oddsTypes: [WIN, PLA]) {
      leg {
        races
      }
      oddsType
      comingleStatus
    }
    poolInvs: pmPools(
      oddsTypes: [WIN, PLA, QIN, QPL, CWA, CWB, CWC, IWN, FCT, TCE, TRI, FF, QTT, DBL, TBL, DT, TT, SixUP]
    ) {
      id
      leg {
        number
        races
      }
      status
      sellStatus
      oddsType
      investment
      mergedPoolId
      lastUpdateTime
    }
    ...racingBlockFragment
    pmPools(oddsTypes: []) {
      id
    }
    jkcInstNo: foPools(oddsTypes: [JKC], filters: ["top"]) {
      instNo
    }
    tncInstNo: foPools(oddsTypes: [TNC], filters: ["top"]) {
      instNo
    }
  }
}`

export const horseOddsQuery = `
query racing($date: String, $venueCode: String, $oddsTypes: [OddsType], $raceNo: Int) {
  raceMeetings(date: $date, venueCode: $venueCode) {
    pmPools(oddsTypes: $oddsTypes, raceNo: $raceNo) {
      id
      status
      sellStatus
      oddsType
      lastUpdateTime
      guarantee
      minTicketCost
      name_en
      name_ch
      leg {
        number
        races
      }
      cWinSelections {
        composite
        name_ch
        name_en
        starters
      }
      oddsNodes {
        combString
        oddsValue
        hotFavourite
        oddsDropValue
        bankerOdds {
          combString
          oddsValue
        }
      }
    }
  }
}`

export const horsePoolQuery = `
query racing($date: String, $venueCode: String, $oddsTypes: [OddsType], $raceNo: Int) {
  raceMeetings(date: $date, venueCode: $venueCode) {
    totalInvestment
    poolInvs: pmPools(oddsTypes: $oddsTypes, raceNo: $raceNo) {
      id
      leg {
        number
        races
      }
      status
      sellStatus
      oddsType
      investment
      mergedPoolId
      lastUpdateTime
    }
  }
}`