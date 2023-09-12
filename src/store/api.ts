import axios, { AxiosError } from 'axios';
import { Dayjs } from 'dayjs';

export const getData = <T>(endpoint: string, success: (data: T) => void, err: (error: Error | AxiosError) => void) => {
    axios
        .get(`${window.API_PATH}/${endpoint}`)
        .then(({ data }) => success(data))
        .catch((error) => {
            console.error();
            err(error);
        });
};

export const searchStations = (
    searchExpressions: StationSearchExpressions,
    success: (data: StationSummary[]) => void
) => {
    const expressions: Array<SearchExpression | SearchExpressionGroup> = [];

    const addExpression = (column_name: string, operator: string, values: (Dayjs | string | null)[]) => {
        if (column_name === 'date') {
            if (values[0] && values[1]) {
                // start_date and end_date expressions should be combined with AND,
                // `date >= start_state OR date <= end_state` doesn't make any sense, because it's always true.
                expressions.push({
                    join: 'AND',
                    expressions: [
                        {
                            column_name,
                            search_term: values[0],
                            operator: 'ge'
                        },
                        {
                            column_name,
                            search_term: values[1],
                            operator: 'le'
                        }
                    ]
                } as SearchExpressionGroup);
            } else if (values[0]) {
                expressions.push({
                    column_name,
                    search_term: values[0],
                    operator: 'ge'
                } as SearchExpression);
            } else if (values[1]) {
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
                        }) as SearchExpression
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
                      join: searchExpressions.join ?? 'AND',
                      expressions
                  }
                : expressions[0];

        axios
            .post(`${window.API_PATH}/stations/search/`, data)
            .then((resp) => success(resp.data))
            .catch(console.error);
    } else {
        // TODO: handle empty filter list on backend
        success([]);
    }
};
