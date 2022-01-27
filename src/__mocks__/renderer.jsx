// ************************************ //
// ************************************ //

// { THIS NEEDS TO BE COPIED CURRENTLY }  //
// This is some quirk with jest, it cannot access this for mocking modules
// as it is itself a … module :-D

// ************************************ //
// ************************************ //

/** @type {(componentName: string, mapProps?: (props: any) => any) => React.FC<any>} */
export const toJSON =
    (componentName, mapProps = (props) => props) =>
    ({ children, ...props }) =>
        (
            <div>
                <h3>{componentName}</h3>
                <pre>{JSON.stringify(mapProps(props), null, 2)}</pre>
                <div>{children}</div>
            </div>
        )

export const bootstrap = () =>
    jest.mock('react-bootstrap', () => ({
        Tab: toJSON('Tab', ({ title, ...props }) => props),
        Tabs: toJSON('Tabs'),
    }))
