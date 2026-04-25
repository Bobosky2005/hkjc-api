import { HKJCClient, defaultClient } from '../client';
import {
    FootballMatch,
    FootballOddsType
} from '../types/football';
import {
    footballMatchesQuery,
    footballMatchDetailsQuery,
    runningMatchQuery
} from '../query/footballMatchesQuery';

interface FootballMatchesResponse {
    matches: FootballMatch[];
}

/**
 * Default odds types for `getAllFootballMatches`. HKJC's downstream rejects
 * large odds-type sets with `DOWNSTREAM_SERVICE_ERROR`, so the default is a
 * small, broadly-useful set: 1X2, handicap, over/under, correct score.
 */
export const DEFAULT_FOOTBALL_ODDS_TYPES: FootballOddsType[] = [
    'HAD', 'HDC', 'HIL', 'CRS'
];

/**
 * Odds types known to be rejected by HKJC's API in any combination.
 * These appear to be deprecated early-settlement market variants.
 */
export const DEPRECATED_FOOTBALL_ODDS_TYPES: FootballOddsType[] = [
    'EHA', 'EDC', 'EHL', 'ECH', 'ECS', 'ETG', 'ENT', 'ECD', 'EHH'
];

/**
 * Odds types that currently respond from the HKJC API. Use these for building
 * your own filtered request, but cap each call at ~4-5 types — large requests
 * are rejected with `DOWNSTREAM_SERVICE_ERROR`.
 */
export const SUPPORTED_FOOTBALL_ODDS_TYPES: FootballOddsType[] = [
    'HAD', 'SGA', 'CHP', 'TQL', 'FHA', 'HHA', 'HDC', 'HIL', 'FHL', 'CHL',
    'FCH', 'CRS', 'FCS', 'FTS', 'TTG', 'OOE', 'FGS', 'HFT', 'MSP', 'NTS',
    'FHH', 'FHC', 'CHD', 'AGS', 'LGS'
];

export interface FootballMatchesOptions {
    startDate?: string | null;
    endDate?: string | null;
    tournIds?: string[] | null;
    matchIds?: string[] | null;
    oddsTypes?: FootballOddsType[];
    featuredMatchesOnly?: boolean;
    frontEndIds?: string[] | null;
    earlySettlementOnly?: boolean;
    showAllMatch?: boolean;
    startIndex?: number | null;
    endIndex?: number | null;
}

export class FootballAPI {
    private client: HKJCClient;

    constructor(client?: HKJCClient) {
        this.client = client || defaultClient;
    }

    /**
     * Get all football matches with associated odds
     * @param options Optional parameters to filter matches
     * @returns A list of football matches
     */
    async getAllFootballMatches(options: FootballMatchesOptions = {}): Promise<FootballMatch[]> {
        const {
            startDate = null,
            endDate = null,
            tournIds = null,
            matchIds = null,
            oddsTypes = DEFAULT_FOOTBALL_ODDS_TYPES,
            featuredMatchesOnly = false,
            frontEndIds = null,
            earlySettlementOnly = false,
            showAllMatch = false,
            startIndex = null,
            endIndex = null
        } = options;

        try {
            const response = await this.client.request<FootballMatchesResponse>(
                footballMatchesQuery,
                {
                    fbOddsTypes: oddsTypes,
                    fbOddsTypesM: oddsTypes,
                    startDate,
                    endDate,
                    tournIds,
                    matchIds,
                    featuredMatchesOnly,
                    frontEndIds,
                    earlySettlementOnly,
                    showAllMatch,
                    startIndex,
                    endIndex
                }
            );


            return response && response.matches ? response.matches : [];
        } catch (error) {
            console.error('Error fetching football matches:', error);
            return [];
        }
    }

    /**
     * Get detailed information for a specific football match
     * @param matchId The ID of the match to retrieve
     * @param oddsTypes The types of odds to retrieve for the match
     * @returns Detailed information for the specified match
     */
    async getFootballMatchDetails(matchId: string, oddsTypes?: FootballOddsType[]): Promise<FootballMatch | null> {
        if (!matchId) {
            throw new Error('Match ID is required');
        }

        const effectiveOddsTypes = oddsTypes || DEFAULT_FOOTBALL_ODDS_TYPES;

        try {
            const response = await this.client.request<FootballMatchesResponse>(
                footballMatchDetailsQuery,
                {
                    matchIds: [matchId],
                    fbOddsTypes: effectiveOddsTypes,
                    fbOddsTypesM: effectiveOddsTypes,
                    featuredMatchesOnly: false,
                    startDate: null,
                    endDate: null,
                    tournIds: null,
                    tournId: null,
                    tournProfileId: null,
                    subType: null,
                    startIndex: null,
                    endIndex: null,
                    frontEndIds: null,
                    earlySettlementOnly: false,
                    showAllMatch: false
                }
            );

            if (response && response.matches && response.matches.length > 0) {
                return response.matches[0];
            }
            return null;
        } catch (error) {
            console.error('Error fetching football match details:', error);
            return null;
        }
    }

    /**
     * Get running match data using the specific running query
     * @param matchId Single match ID (string or number)
     * @returns Football match data using the running query
     */
    async getRunningMatch(matchId: string | number): Promise<FootballMatch[]> {
        // Convert single ID to array format for the API call
        const matchIds = [String(matchId)];

        const fbOddsTypes: FootballOddsType[] = DEFAULT_FOOTBALL_ODDS_TYPES;

        try {
            const response = await this.client.request<FootballMatchesResponse>(
                runningMatchQuery,
                {
                    fbOddsTypes,
                    fbOddsTypesM: fbOddsTypes,
                    inplayOnly: true,
                    featuredMatchesOnly: false,
                    startDate: null,
                    endDate: null,
                    tournIds: null,
                    matchIds,
                    startIndex: null,
                    endIndex: null,
                    frontEndIds: null,
                    earlySettlementOnly: false,
                    showAllMatch: false
                }
            );

            return response && response.matches ? response.matches : [];
        } catch (error) {
            console.error('Error fetching running match data:', error);
            return [];
        }
    }
}
