export interface Horse {
  id: string;
  code: string;
}

export interface Jockey {
  code: string;
  name_en: string;
  name_ch: string;
}

export interface Trainer {
  code: string;
  name_en: string;
  name_ch: string;
}

export interface Runner {
  id: string;
  no: string;
  standbyNo: string;
  status: string;
  name_ch: string;
  name_en: string;
  horse: Horse;
  color: string;
  barrierDrawNumber: number;
  handicapWeight: number;
  currentWeight: number;
  currentRating: number;
  internationalRating: number;
  gearInfo: string;
  racingColorFileName: string;
  allowance: number;
  trainerPreference: string;
  last6run: string;
  saddleClothNo: string;
  trumpCard: boolean;
  priority: number;
  finalPosition: number;
  deadHeat: boolean;
  winOdds: number;
  jockey: Jockey;
  trainer: Trainer;
}

export interface RaceTrack {
  description_en: string;
  description_ch: string;
}

export interface RaceCourse {
  description_en: string;
  description_ch: string;
  displayCode: string;
}

export interface JudgeSign {
  value_en: string;
}

export interface Race {
  id: string;
  no: string;
  status: string;
  raceName_en: string;
  raceName_ch: string;
  postTime: string;
  country_en: string;
  country_ch: string;
  distance: number;
  wageringFieldSize: number;
  go_en: string;
  go_ch: string;
  ratingType: string;
  raceTrack: RaceTrack;
  raceCourse: RaceCourse;
  claCode: string;
  raceClass_en: string;
  raceClass_ch: string;
  judgeSigns: JudgeSign[];
  runners: Runner[];
}

export interface Country {
  code: string;
  namech: string;
  nameen: string;
  seq: number;
}

export interface Pool {
  id: string;
  leg: {
    number: number;
    races: number[];
  };
  status: string;
  sellStatus: string;
  oddsType: string;
  investment: number;
  mergedPoolId: string;
  lastUpdateTime: string;
}

export interface RaceMeeting {
  id: string;
  status: string;
  venueCode: string;
  date: string;
  totalNumberOfRace: number;
  currentNumberOfRace: number;
  dateOfWeek: string;
  meetingType: string;
  totalInvestment: number;
  country: Country;
  races: Race[];
  poolInvs: Pool[];
}
