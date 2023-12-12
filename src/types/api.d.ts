interface SearchExpression {
    column_name: string;
    search_term: string;
    operator: 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le' | 'contains';
    fuzzy?: boolean;
    min_string_similarity?: number;
}

type BooleanOperator = 'AND' | 'OR';

interface SearchExpressionGroup {
    join: BooleanOperator;
    expressions: Array<SearchExpression | SearchExpressionGroup>;
}

interface StationSearchExpressions {
    join?: BooleanOperator;
    stationNames: string[];
    faoAreas: number[];
    species: string[];
    dates: (import('dayjs').Dayjs | null)[];
}
