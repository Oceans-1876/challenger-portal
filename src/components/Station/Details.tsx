import React from 'react';
import { PlaceOutlined, ScienceOutlined, SettingsOutlined } from '@mui/icons-material';
import Field from './Field';

interface Props {
    station: StationDetails | null;
}

const Details = ({ station }: Props) => {
    return (
        <>
            <Field
                title="Location"
                content={station?.location ?? '\u00A0'}
                properties={{
                    'Place': station?.place,
                    'Water Body': station?.water_body,
                    'Sea Area': station?.sea_area,
                    'FAO Area': station?.fao_area
                }}
                IconComponent={PlaceOutlined}
            />
            <Field title="Gear" content={station?.gear ?? '\u00A0'} IconComponent={SettingsOutlined} />
            <Field
                title="Sediment Sample"
                content={station?.sediment_sample ?? '\u00A0'}
                IconComponent={ScienceOutlined}
            />
        </>
    );
};

export default Details;
