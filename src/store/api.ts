import axios from 'axios';
import { Dayjs } from 'dayjs';

export const getData = <T>(endpoint: string, success: (data: T) => void) => {
    axios
        .get(`${API_PATH}/${endpoint}`)
        .then(({ data }) => success(data))
        .catch(console.error);
};

export const searchStations = (
    searchExpressions: StationSearchExpressions,
    success: (data: StationSummary[]) => void
) => {
    const expressions: Array<SearchExpression | SearchExpressionGroup> = [];

    const addExpression = (column_name: string, operator: string, values: (Dayjs | string | null)[]) => {
        if (column_name === 'date') {
            if (values[0]) {
                expressions.push({
                    column_name,
                    search_term: values[0],
                    operator: 'ge'
                } as SearchExpression);
            }
            if (values[1]) {
                expressions.push({
                    column_name,
                    search_term: values[1],
                    operator: 'le'
                } as SearchExpression);
            }
        } else if (values.length > 1) {
            expressions.push({
                join: 'OR',
                expressions: values.map(
                    (value) =>
                        ({
                            column_name,
                            search_term: value,
                            operator
                        } as SearchExpression)
                )
            });
        } else if (values.length === 1) {
            expressions.push({
                column_name,
                search_term: values[0],
                operator
            } as SearchExpression);
        }
    };

    addExpression('name', 'eq', searchExpressions.stationNames);
    addExpression('fao_area', 'eq', searchExpressions.faoAreas);
    addExpression('species_id', 'eq', searchExpressions.species);
    addExpression('date', 'ge', searchExpressions.dates);

    if (expressions.length) {
        const data =
            expressions.length > 1
                ? {
                      join: 'AND',
                      expressions
                  }
                : expressions[0];

        axios
            .post(`${API_PATH}/stations/search/`, data)
            .then((resp) => success(resp.data))
            .catch(console.error);
    }
};
