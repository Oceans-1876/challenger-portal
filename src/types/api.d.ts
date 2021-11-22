interface SearchExpression {
    column_name: string;
    search_term: string;
    operator: 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le' | 'contains';
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
