import { SvgIconComponent } from '@mui/icons-material';
import {
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { FC } from 'react';
import { theme } from '../../theme';

type FieldValueDict = Record<string, string | number | undefined>;
type FieldValueTable = {
    columns: { key: string; label: string }[];
    rows: Record<string, string>[];
};

const FieldProperties: FC<{ data: FieldValueDict }> = ({ data }) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    return (
        <Stack
            direction="row"
            sx={{ my: '8px', py: '16px', px: '24px', gap: '16px', background: '#90FFF31F', borderRadius: '12px' }}
        >
            <Box sx={{ color: theme.palette.explore.secondaryText }}>
                {keys.map((key) => (
                    <Typography key={key} sx={{ fontWeight: 600 }}>
                        {key}
                    </Typography>
                ))}
            </Box>
            <Box sx={{ color: 'white', fontWeight: 600 }}>
                {values.map((value, i) => (
                    <Typography key={keys[i]}>{value}&nbsp;</Typography>
                ))}
            </Box>
        </Stack>
    );
};

const FieldTable: FC<{ table: FieldValueTable }> = ({ table }) => (
    <TableContainer sx={{}}>
        <Table
            size="small"
            sx={{
                'background': 'rgba(255, 255, 255, 0.15)',
                '& tr': {
                    height: 32
                },
                '& th, & td': {
                    color: 'white',
                    border: `1px solid ${theme.palette.explore.mainTransparent}`
                }
            }}
        >
            <TableHead sx={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                <TableRow>
                    {table.columns.map((column) => (
                        <TableCell key={column.key}>{column.label}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {table.rows.map((row, i) => (
                    <TableRow key={i} sx={{ background: '#0' }}>
                        {table.columns.map((column) => (
                            <TableCell key={column.key}>{row[column.key]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

type Props = {
    title: string;
    IconComponent: SvgIconComponent;
    content?: string;
    properties?: FieldValueDict;
    table?: FieldValueTable;
};

const Field: FC<Props> = ({ title, IconComponent, content, properties, table }) => {
    return (
        <>
            <Box sx={{ my: '16px' }}>
                <Stack
                    direction="row"
                    sx={{ height: 28, color: theme.palette.explore.secondaryText, fontSize: '16px' }}
                >
                    <IconComponent sx={{ width: '32px' }} />
                    <Typography sx={{ fontWeight: 600 }}>{title}:</Typography>
                </Stack>
                <Typography sx={{ ml: '32px', color: 'white', fontSize: '16px', fontWeight: 400 }}>
                    {content}
                </Typography>
            </Box>
            {properties ? <FieldProperties data={properties} /> : null}
            {table ? <FieldTable table={table} /> : null}
        </>
    );
};

export default Field;
