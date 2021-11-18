interface SearchExpression {
    column_name: string;
    search_term: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';
    min_string_similarity?: number;
}

interface SearchExpressionGroup {
    join: 'AND' | 'OR';
    expressions: Array<SearchExpression | SearchExpressionGroup>;
}

interface StationSearchExpressions {
    stationNames: string[];
    faoAreas: string[];
    species: string[];
    dates: (string | null)[];
}
