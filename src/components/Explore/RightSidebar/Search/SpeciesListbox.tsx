import React, { HTMLAttributes, createContext, forwardRef, useContext, useEffect, useRef } from 'react';
import { AutocompleteRenderOptionState, Box, Typography } from '@mui/material';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import { theme } from '@app/theme';

const LISTBOX_PADDING = 8;
const ROW_HEIGHT = 64;

type RowType = [HTMLAttributes<HTMLLIElement>, SpeciesSummary, AutocompleteRenderOptionState];

// scroll container
const OuterElementPropsContext = createContext<HTMLAttributes<HTMLDivElement>>({});
const OuterElementType = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
    const outerProps = useContext(OuterElementPropsContext);
    return <div ref={ref} {...props} {...outerProps} />;
});
OuterElementType.displayName = 'OuterElement';

// scroll content
const InnerElementType = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>((props, ref) => {
    const { style, ...otherProps } = props;
    return <ul ref={ref} style={{ ...style, margin: 0 }} {...otherProps} />;
});
InnerElementType.displayName = 'InnerElement';

function renderRow(props: ListChildComponentProps<Array<RowType>>) {
    const { data, index, style } = props;
    const [rowProps, species] = data[index];

    return (
        <Box
            component="li"
            {...rowProps}
            sx={{
                ...style,
                top: (style.top as number) + LISTBOX_PADDING,
                height: ROW_HEIGHT
            }}
        >
            <Box sx={{ width: '100%' }}>
                <Typography>{species.matched_canonical_full_name ?? '(none)'}</Typography>
                <Typography
                    variant="caption"
                    noWrap
                    sx={{
                        display: 'block',
                        fontStyle: 'italic',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {species.current_name ?? '(none)'}
                </Typography>
            </Box>
        </Box>
    );
}

const SpeciesListbox = forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement>>((props, ref) => {
    const { children, ...outerProps } = props;
    const itemData = children as RowType[];
    const itemCount = itemData.length;

    const listRef = useRef<VariableSizeList>(null);
    useEffect(() => {
        if (listRef.current != null) {
            listRef.current.resetAfterIndex(0, true);
        }
    }, [itemCount]);

    return (
        <OuterElementPropsContext.Provider value={outerProps}>
            <div ref={ref} style={{ background: theme.palette.explore.main }}>
                <VariableSizeList
                    ref={listRef}
                    itemData={itemData}
                    itemCount={itemCount}
                    overscanCount={5}
                    outerElementType={OuterElementType}
                    innerElementType={InnerElementType}
                    height={Math.min(itemCount, 8) * ROW_HEIGHT}
                    width="100%"
                    itemSize={() => ROW_HEIGHT}
                >
                    {renderRow}
                </VariableSizeList>
            </div>
        </OuterElementPropsContext.Provider>
    );
});
SpeciesListbox.displayName = 'SpeciesListbox';

export default SpeciesListbox;
