import axios from 'axios';

export const getData = <T>(endpoint: string, success: (data: T) => void) => {
    axios
        .get(`${API_PATH}/${endpoint}`)
        .then(({ data }) => success(data))
        .catch(console.error);
};
