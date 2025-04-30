import { HKJCClient, defaultClient } from '../client';
import {
    FootballMatch,
    FootballOddsType
} from '../types/football';
import {
    footballMatchesQuery,
    footballMatchDetailsQuery
} from '../query/footballMatchesQuery';

interface FootballMatchesResponse {
    matches: FootballMatch[];
}

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
            oddsTypes = [
                "HAD", "EHA", "SGA", "CHP", "TQL", "FHA", "HHA", "HDC", "EDC", "HIL",
                "EHL", "FHL", "CHL", "ECH", "FCH", "CRS", "ECS", "FCS", "FTS", "TTG",
                "ETG", "OOE", "FGS", "HFT", "MSP", "NTS", "ENT", "FHH", "FHC", "CHD",
                "ECD", "EHH", "AGS", "LGS"
            ],
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

        const defaultOddsTypes: FootballOddsType[] = [
            "HAD", "EHA", "SGA", "CHP", "TQL", "FHA", "HHA", "HDC", "EDC", "HIL",
            "EHL", "FHL", "CHL", "ECH", "FCH", "CRS", "ECS", "FCS", "FTS", "TTG",
            "ETG", "OOE", "FGS", "HFT", "MSP", "NTS", "ENT", "FHH", "FHC", "CHD",
            "ECD", "EHH", "AGS", "LGS"
        ];

        try {
            const response = await this.client.request<FootballMatchesResponse>(
                footballMatchDetailsQuery,
                {
                    matchIds: [matchId],
                    fbOddsTypes: oddsTypes || defaultOddsTypes,
                    fbOddsTypesM: oddsTypes || defaultOddsTypes,
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
}
