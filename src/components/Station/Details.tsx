import React from 'react';
import { PlaceOutlined, ScienceOutlined, SettingsOutlined } from '@mui/icons-material';
import Field from './Field';

interface Props {
    station: StationDetails;
}

const Details = ({ station }: Props) => (
    <>
        <Field
            title="Location"
            content={station.location}
            properties={{
                'Place': station.place,
                'Water Body': station.water_body,
                'Sea Area': station.sea_area,
                'FAO Area': station.fao_area
            }}
            IconComponent={PlaceOutlined}
        />
        <Field title="Gear" content={station.gear} IconComponent={SettingsOutlined} />
        <Field title="Sediment Sample" content={station.sediment_sample} IconComponent={ScienceOutlined} />
    </>
);

export default Details;
