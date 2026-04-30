export interface FootballTeam {
  id: string;
  name_en: string;
  name_ch: string;
}

export interface Tournament {
  id: string;
  frontEndId: string;
  nameProfileId: string;
  isInteractiveServiceAvailable: boolean;
  code: string;
  name_en: string;
  name_ch: string;
}

export interface PoolInfo {
  normalPools: string[];
  inplayPools: string[];
  sellingPools: string[];
  ntsInfo: any[];
  entInfo: any[];
  definedPools: string[];
}

export interface RunningResult {
  homeScore: number;
  awayScore: number;
  corner: number;
  homeCorner: number;
  awayCorner: number;
}

export interface Selection {
  selId: string;
  str: string;
  name_ch: string;
  name_en: string;
}

export interface Combination {
  combId: string;
  str: string;
  status: string;
  offerEarlySettlement: string;
  currentOdds: string;
  selections: Selection[];
}

export interface OddsLine {
  lineId: string;
  status: string;
  condition: string;
  main: boolean;
  combinations: Combination[];
}

export interface FootballPool {
  id: string;
  status: string;
  oddsType: string;
  instNo: number;
  inplay: boolean;
  name_ch: string;
  name_en: string;
  updateAt: string;
  expectedSuspendDateTime: string;
  lines: OddsLine[];
}

export interface FootballMatch {
  id: string;
  frontEndId: string;
  matchDate: string;
  kickOffTime: string;
  status: string;
  updateAt: string;
  sequence: string;
  esIndicatorEnabled: boolean;
  homeTeam: FootballTeam;
  awayTeam: FootballTeam;
  tournament: Tournament;
  isInteractiveServiceAvailable: boolean;
  inplayDelay: boolean;
  venue: any;
  tvChannels: any[];
  liveEvents: any[];
  featureStartTime: string;
  featureMatchSequence: string;
  poolInfo: PoolInfo;
  runningResult: RunningResult | null;
  runningResultExtra: RunningResult | null;
  adminOperation: {
    remark: any;
  };
  foPools: FootballPool[];
}

export type FootballOddsType =
  'HAD' | 'EHA' | 'SGA' | 'CHP' | 'TQL' | 'FHA' | 'HHA' | 'HDC' | 'EDC' | 'HIL' |
  'EHL' | 'FHL' | 'CHL' | 'ECH' | 'FCH' | 'CRS' | 'ECS' | 'FCS' | 'FTS' | 'TTG' |
  'ETG' | 'OOE' | 'FGS' | 'HFT' | 'MSP' | 'NTS' | 'ENT' | 'FHH' | 'FHC' | 'CHD' |
  'ECD' | 'EHH' | 'AGS' | 'LGS' | 'NGS' | 'ETS' | 'HLH' | 'HLA' | 'FLH' | 'FLA' |
  'ELH' | 'ELA' | 'CHH' | 'CHA' | 'CFH' | 'CFA' | 'CEH' | 'CEA';

export interface FootballMatchesResponse {
  matches: FootballMatch[];
}

export interface HistoricFootballTimeOffset {
  fb: number;
}

export interface HistoricFootballMatchCount {
  total: number;
}

export interface HistoricFootballTournament {
  code: string;
  name_en: string;
  name_ch: string;
}

export interface HistoricFootballResult {
  homeResult: number;
  awayResult: number;
  ttlCornerResult: number;
  resultConfirmType: number;
  payoutConfirmed: boolean;
  stageId: number;
  resultType: number;
  sequence: number;
  mask?: string | null;
}

export interface HistoricFootballPoolInfoItem {
  str: string;
  name_en: string;
  name_ch: string;
  instNo?: number;
}

export interface HistoricFootballPoolInfo {
  payoutRefundPools: FootballOddsType[];
  refundPools: FootballOddsType[];
  ntsInfo: string[] | null;
  entInfo: string[] | null;
  definedPools: FootballOddsType[];
  ngsInfo: HistoricFootballPoolInfoItem[] | null;
  agsInfo: HistoricFootballPoolInfoItem[] | null;
}

export interface HistoricFootballMatch {
  id: string;
  status: string;
  frontEndId: string;
  matchDayOfWeek: string;
  matchNumber: string;
  matchDate: string;
  kickOffTime: string;
  sequence: string;
  homeTeam: FootballTeam;
  awayTeam: FootballTeam;
  tournament: HistoricFootballTournament;
  results: HistoricFootballResult[];
  poolInfo: HistoricFootballPoolInfo;
}

export interface HistoricFootballMatchesResult {
  timeOffset: HistoricFootballTimeOffset;
  matchNumByDate: HistoricFootballMatchCount;
  matches: HistoricFootballMatch[];
}

export interface HistoricFootballResultCombination {
  str: string;
  status: string;
  winOrd: string;
  selections: Selection[];
}

export interface HistoricFootballResultLine {
  combinations: HistoricFootballResultCombination[];
}

export interface HistoricFootballResultPool {
  id: string;
  status: string;
  oddsType: FootballOddsType;
  instNo: number;
  name_ch: string;
  name_en: string;
  lines: HistoricFootballResultLine[];
}

export interface HistoricFootballAdditionalResults {
  resSetId: string;
  results: HistoricFootballResult[];
}

export interface HistoricFootballMatchDetails {
  id: string;
  foPools: HistoricFootballResultPool[];
  additionalResults: HistoricFootballAdditionalResults[];
}
