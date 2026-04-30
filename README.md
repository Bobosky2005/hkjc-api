# HKJC API

A Node.js package for communicating with the Hong Kong Jockey Club (HKJC) GraphQL API.

## Features

- Horse Racing API
  - Get active race meetings
  - Get detailed race information and runners
  - Fetch various odds types (WIN, PLA, QIN, QPL, etc.)
  - Get pool investment data
  
- Football API
  - Get all football matches with filtering options
  - Get detailed information for specific matches
  - Get live/running match data with real-time scores
  - Search historic match results and result-only payout pools
  - Access odds for multiple bet types (HAD, HHA, CRS, etc.)

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Setup](#setup)
  - [Horse Racing API](#horse-racing-api)
    - [Get Race Meetings](#get-race-meetings)
    - [Get Race Information](#get-race-information)
    - [Get Race Runners](#get-race-runners)
    - [Get Race Odds](#get-race-odds)
  - [Football API](#football-api)
    - [Get All Football Matches](#get-all-football-matches)
    - [Get Match Details](#get-match-details)
    - [Get Running/Live Match Data](#get-runninglive-match-data)
    - [Search Historic Match Results](#search-historic-match-results)
- [Available Odds Types](#available-odds-types)
  - [Horse Racing](#horse-racing)
  - [Football](#football)
- [API Limitations](#api-limitations)
- [Examples](#examples)
  - [Horse Racing Example](#horse-racing-example)
  - [Football Example](#football-example)
  - [Historic Football Example](#historic-football-example)
- [Error Handling](#error-handling)
- [License](#license)

---

## Installation

```bash
npm install hkjc-api
```

---

## Usage

### Setup

```typescript
import { HorseRacingAPI, FootballAPI } from 'hkjc-api';

// Initialize the APIs - client is created automatically
const horseRacingAPI = new HorseRacingAPI();
const footballAPI = new FootballAPI();
```

---

### Horse Racing API

#### Get Race Meetings

```typescript
// Get only active meetings
const activeMeetings = await horseRacingAPI.getActiveMeetings();

// Get all race meetings (includes race details)
const raceMeetings = await horseRacingAPI.getAllRaces();
```

#### Get Race Information

```typescript
// Get all races
const races = await horseRacingAPI.getAllRaces();

// Get a specific race (default is race 1)
const race = await horseRacingAPI.getRace(3); // Get race #3
```

#### Get Race Runners

```typescript
// Note: Runner information is included in the race data from getAllRaces() or getRace()
// Access runners through the race object's runners property
const race = await horseRacingAPI.getRace(1);
const runners = race?.runners || [];
```

#### Get Race Odds

```typescript
// Get odds for a specific race and odds types
const oddsResult = await horseRacingAPI.getRaceOdds(
  1,                      // Race number (defaults to 1)
  ['WIN', 'PLA', 'QIN']   // Odds types (defaults to ['WIN', 'PLA'])
);

// Get pool investment data
const poolsResult = await horseRacingAPI.getRacePools(
  1,                      // Race number (defaults to 1)
  ['WIN', 'PLA']          // Odds types (defaults to ['WIN', 'PLA'])
);
```

---

### Football API

#### Get All Football Matches

```typescript
// Get all football matches with the default odds types
// (HAD, HDC, HIL, CRS — see "API limitations" below)
const allMatches = await footballAPI.getAllFootballMatches();

// Get matches with filters
const filteredMatches = await footballAPI.getAllFootballMatches({
  startDate: '2025-04-30',
  endDate: '2025-05-07',
  tournIds: ['50046423'],          // Tournament IDs
  oddsTypes: ['HAD', 'CRS', 'HHA'], // Odds types (cap at ~4 per call)
  featuredMatchesOnly: true        // Only featured matches
});
```

> ⚠️ **API limitations on `oddsTypes`** — HKJC's downstream rejects large
> odds-type sets with `Internal server error - DOWNSTREAM_SERVICE_ERROR`.
> Stick to **~4 odds types per call**, and avoid the deprecated
> early-settlement variants. See [API Limitations](#api-limitations)
> below if you need every market — fan out and merge by `match.id`.

#### Get Match Details

```typescript
// Get details for a specific match
const matchDetails = await footballAPI.getFootballMatchDetails('50047131');

// Get details with specific odds types only
const matchWithSpecificOdds = await footballAPI.getFootballMatchDetails(
  '50047131',
  ['HAD', 'HHA', 'CRS']
);
```

#### Get Running/Live Match Data

```typescript
// Get running match data for a single match ID (string)
const runningMatch1 = await footballAPI.getRunningMatch('50049157');

// Get running match data for a single match ID (number)
const runningMatch2 = await footballAPI.getRunningMatch(50049157);

// The method returns live match data including:
// - Real-time scores (runningResult)
// - Live odds and betting pools
// - Match status and updates
// - In-play specific information

// Note: getRunningMatch is specifically optimized for live/in-play matches
// and includes real-time data that may not be available in getAllFootballMatches
// or getFootballMatchDetails methods. Currently only supports single match IDs.
```

#### Search Historic Match Results

Use these methods for completed football matches and payout/result data. They
call HKJC's `matchResult` GraphQL endpoint, which is separate from the live and
upcoming `matches` endpoint used by `getAllFootballMatches`.

```typescript
// Search historic football match results by date and optional pagination/team
const historicResult = await footballAPI.searchHistoricFootballMatches({
  startDate: '2026-04-30',
  endDate: '2026-04-30',
  startIndex: 0,
  endIndex: 20,
  teamId: null
});

console.log(`Total historic matches: ${historicResult.matchNumByDate.total}`);
console.log(`Returned matches: ${historicResult.matches.length}`);

// If you only need the match array, use the convenience method
const historicMatches = await footballAPI.getHistoricFootballMatches({
  startDate: '2026-04-30',
  endDate: '2026-04-30'
});

// Fetch result-only payout pool details for a historic match
const historicDetails = await footballAPI.getHistoricFootballMatchDetails(
  '50067456'
);

console.log(`Result pools: ${historicDetails?.foPools.length || 0}`);

// You can also pass specific result pool types
const hadResult = await footballAPI.getHistoricFootballMatchDetails(
  '50067456',
  ['HAD', 'CRS', 'TTG']
);
```

Available methods:

| Method | Returns | Description |
| --- | --- | --- |
| `searchHistoricFootballMatches(options?)` | `HistoricFootballMatchesResult` | Search historic matches and keep search metadata such as total count and football time offset. |
| `getHistoricFootballMatches(options?)` | `HistoricFootballMatch[]` | Convenience wrapper that returns only the historic match array. |
| `getHistoricFootballMatchDetails(matchId, oddsTypes?)` | `HistoricFootballMatchDetails \| null` | Fetch result-only payout pool details for one historic match. |

`searchHistoricFootballMatches` and `getHistoricFootballMatches` accept:

| Option | Type | Description |
| --- | --- | --- |
| `startDate` | `string \| null` | Start date for the historic search, for example `2026-04-30`. |
| `endDate` | `string \| null` | End date for the historic search, for example `2026-04-30`. |
| `startIndex` | `number \| null` | Optional pagination start index. |
| `endIndex` | `number \| null` | Optional pagination end index. |
| `teamId` | `string \| null` | Optional HKJC team ID filter. |

`HistoricFootballMatchesResult` contains:

| Field | Description |
| --- | --- |
| `timeOffset.fb` | HKJC football time offset value. |
| `matchNumByDate.total` | Total number of historic matches matching the date/team filters. |
| `matches` | Historic match list, including teams, tournament, score/result rows, and pool summary fields. |

`getHistoricFootballMatchDetails` returns result-only pools:

| Field | Description |
| --- | --- |
| `id` | Historic match ID. |
| `foPools` | Result-only football pools with combinations, selection labels, statuses, and winning order. |
| `additionalResults` | Extra result sets returned by HKJC, when available. |

---

## Available Odds Types

### Horse Racing

The following odds types are supported for horse racing:

- `WIN` - Win (獨贏)
- `PLA` - Place (位置)
- `QIN` - Quinella (連贏)
- `QPL` - Quinella Place (位置Q)
- `CWA` - Composite Win A (組合獨贏A)
- `CWB` - Composite Win B (組合獨贏B)
- `CWC` - Composite Win C (組合獨贏C)
- `IWN` - Investment Win (投資獨贏)
- `FCT` - Forecast (二重彩)
- `TCE` - Tierce (三重彩)
- `TRI` - Trio (單T)
- `FF` - First Four (四連環)
- `QTT` - Quartet (四重彩)
- `DBL` - Double (孖寶)
- `TBL` - Treble (三寶)
- `DT` - Double Trio (孖T)
- `TT` - Triple Trio (三T)
- `SixUP` - Six Up (六環彩)

### Football

The following odds types are accepted by the HKJC API:

| Code | Description (EN / 中) |
| --- | --- |
| `HAD` | Home/Away/Draw — 主客和 |
| `SGA` | Special Group A — 特別組A |
| `CHP` | Championship — 冠軍 |
| `TQL` | To Qualify — 晉級 |
| `FHA` | First Half Home/Away/Draw — 半場主客和 |
| `HHA` | Handicap Home/Away — 讓球主客 |
| `HDC` | Handicap — 讓球 |
| `HIL` | Hi/Lo (Over/Under) — 大細 |
| `FHL` | First Half Hi/Lo — 半場大細 |
| `CHL` | Corner Hi/Lo — 角球大細 |
| `FCH` | First Half Corner Hi/Lo — 半場角球大細 |
| `CRS` | Correct Score — 波膽 |
| `FCS` | First Half Correct Score — 半場波膽 |
| `FTS` | First Team to Score — 首隊入球 |
| `TTG` | Total Goals — 總入球 |
| `OOE` | Odd/Even — 單雙 |
| `FGS` | First Goalscorer — 首名入球 |
| `HFT` | Halftime/Fulltime — 半全場 |
| `MSP` | Multi-Scoring — 多項入球 |
| `NTS` | Anytime Goalscorer — 入球球員 |
| `FHH` | First Half Handicap — 半場讓球 |
| `FHC` | First Half Corner — 半場角球 |
| `CHD` | Corner Handicap — 角球讓球 |
| `AGS` | Anytime Goalscorer — 全場任何時間入球 |
| `LGS` | Last Goalscorer — 最後入球 |

Historic result details can request a wider result-only list through
`DEFAULT_HISTORIC_FOOTBALL_RESULT_ODDS_TYPES`:

```typescript
[
  'HAD', 'SGA', 'EHA', 'FHA', 'TQL', 'CRS', 'FCS', 'ECS', 'TTG', 'ETG',
  'OOE', 'FGS', 'NGS', 'AGS', 'LGS', 'HFT', 'FTS', 'NTS', 'ENT', 'ETS',
  'MSP', 'CHL', 'ECH', 'FCH', 'FHC', 'CHD', 'ECD', 'EHH', 'FHH', 'HLH',
  'HLA', 'FLH', 'FLA', 'ELH', 'ELA', 'CHH', 'CHA', 'CFH', 'CFA', 'CEH',
  'CEA'
]
```

The package exports these as constants for convenience:

```typescript
import {
  DEFAULT_FOOTBALL_ODDS_TYPES,      // ['HAD', 'HDC', 'HIL', 'CRS']
  SUPPORTED_FOOTBALL_ODDS_TYPES,    // 25 working market codes
  DEPRECATED_FOOTBALL_ODDS_TYPES,   // 9 codes the upstream rejects
  DEFAULT_HISTORIC_FOOTBALL_RESULT_ODDS_TYPES // result-only historic pool codes
} from 'hkjc-api';
```

#### Deprecated — currently rejected by HKJC

The early-settlement variants below are still part of the GraphQL schema but
the upstream service returns `DOWNSTREAM_SERVICE_ERROR` whenever they appear
in a request. Avoid them.

`EHA`, `EDC`, `EHL`, `ECH`, `ECS`, `ETG`, `ENT`, `ECD`, `EHH`

---

## API Limitations

HKJC's GraphQL endpoint imposes a response-size ceiling that isn't reflected
in the schema. Findings that affect how you should call this package:

1. **Cap `oddsTypes` at ~4 per call.** Five or more "wide" markets
   (`CRS`, `HIL`, `TQL`, `FHL`, `CHL`) trigger
   `Internal server error - DOWNSTREAM_SERVICE_ERROR` and the SDK falls back
   to an empty array.
2. **Avoid the 9 deprecated `E`-prefix early-settlement codes** above — they
   fail in any combination, even alone.
3. **Filters (`startDate`, `featuredMatchesOnly`, pagination) don't lift the
   cap.** The limit is on the response body, not the match list.
4. **Need every market for every match?** Fan out into multiple small calls
   and merge by `match.id`. Match metadata is identical across calls; only
   `foPools` differs.

```typescript
import {
  FootballAPI,
  SUPPORTED_FOOTBALL_ODDS_TYPES,
  FootballMatch
} from 'hkjc-api';

const api = new FootballAPI();
const batchSize = 4;
const merged = new Map<string, FootballMatch>();

for (let i = 0; i < SUPPORTED_FOOTBALL_ODDS_TYPES.length; i += batchSize) {
  const batch = SUPPORTED_FOOTBALL_ODDS_TYPES.slice(i, i + batchSize);
  const matches = await api.getAllFootballMatches({ oddsTypes: batch });
  for (const m of matches) {
    const existing = merged.get(m.id);
    if (existing) existing.foPools.push(...m.foPools);
    else merged.set(m.id, m);
  }
}

const allMatches = Array.from(merged.values());
```

---

## Examples

### Horse Racing Example

```typescript
const { HorseRacingAPI } = require('hkjc-api');
const horseAPI = new HorseRacingAPI();

// Get active meetings
const activeMeetings = await horseAPI.getActiveMeetings();
console.log(`Found ${activeMeetings.length} active meetings`);

// Get today's race information
const races = await horseAPI.getAllRaces();
console.log(`Found ${races[0]?.races.length || 0} races today`);

// Get WIN and PLA odds for race #1
const raceOdds = await horseAPI.getRaceOdds(1, ['WIN', 'PLA']);
console.log(`WIN/PLA odds for race #1:`, raceOdds);
```

### Football Example

```typescript
const { FootballAPI } = require('hkjc-api');
const footballAPI = new FootballAPI();

// Get all matches (default odds types: HAD, HDC, HIL, CRS)
const matches = await footballAPI.getAllFootballMatches();
console.log(`Found ${matches.length} football matches`);

// Filter to upcoming matches only
const upcoming = matches.filter(m => new Date(m.kickOffTime) > new Date());
console.log(`${upcoming.length} upcoming matches`);

// Get details for the first match
if (matches.length > 0) {
  const matchId = matches[0].id;
  const matchDetails = await footballAPI.getFootballMatchDetails(
    matchId,
    ['HAD', 'HDC', 'HIL', 'CRS'] // keep odds types small to avoid upstream errors
  );

  console.log(`Match: ${matchDetails.homeTeam.name_en} vs ${matchDetails.awayTeam.name_en}`);
  console.log(`Date: ${matchDetails.matchDate}`);
  console.log(`Kick-off: ${matchDetails.kickOffTime}`);

  // Get live running match data for real-time scores
  const runningData = await footballAPI.getRunningMatch(matchId);
  if (runningData.length > 0) {
    const liveMatch = runningData[0];
    console.log(`Live Score: ${liveMatch.runningResult?.homeScore || 0}:${liveMatch.runningResult?.awayScore || 0}`);
    console.log(`Status: ${liveMatch.status}`);
  }
}
```

### Historic Football Example

```typescript
const { FootballAPI } = require('hkjc-api');
const footballAPI = new FootballAPI();

const results = await footballAPI.searchHistoricFootballMatches({
  startDate: '2026-04-30',
  endDate: '2026-04-30',
  startIndex: 0,
  endIndex: 20
});

console.log(`Total matches: ${results.matchNumByDate.total}`);

for (const match of results.matches) {
  const score = match.results.find(result => result.resultType === 1);
  console.log(
    `${match.frontEndId}: ${match.homeTeam.name_en} ${score?.homeResult ?? '-'} - ` +
    `${score?.awayResult ?? '-'} ${match.awayTeam.name_en}`
  );
}

if (results.matches.length > 0) {
  const details = await footballAPI.getHistoricFootballMatchDetails(
    results.matches[0].id,
    ['HAD', 'CRS', 'TTG']
  );

  const winningHad = details?.foPools
    .find(pool => pool.oddsType === 'HAD')
    ?.lines.flatMap(line => line.combinations)
    .filter(combination => combination.status === 'WIN');

  console.log('Winning HAD selections:', winningHad);
}
```

## Error Handling

Both APIs include proper error handling. Methods return `null`, empty arrays,
or an empty historic result object when data is not found or an upstream request
fails. Methods that require a match ID throw when the ID is missing.

```typescript
try {
  const match = await footballAPI.getFootballMatchDetails('invalid-id');
  if (match === null) {
    console.log('Match not found');
  }

  const historicDetails = await footballAPI.getHistoricFootballMatchDetails('50067456');
  if (historicDetails === null) {
    console.log('Historic match result details not found');
  }
} catch (error) {
  console.error('API error:', error);
}
```

## License

MIT
