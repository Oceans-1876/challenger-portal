import React from 'react';

/**
 * A higher-order component that wraps a component with the given Layout
 * @param Layout layout component
 * @param Component the component to wrap in the layout
 * @param layoutProps extra props to pass to the Layout component
 */
export const withLayout = <P extends Record<string, unknown>>(
    Layout: React.ComponentType<P>,
    Component: React.ComponentType,
    layoutProps: P = {} as P
): React.ReactElement => {
    const ComponentWithLayout = () => (
        <Layout {...layoutProps}>
            <Component />
        </Layout>
    );
    ComponentWithLayout.displayName = `${Component.displayName}With${Layout.displayName}`;
    return <ComponentWithLayout />;
};
