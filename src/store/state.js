/**
 * @typedef {Object} Collection
 */

/**
 * @typedef {'collections'} Resources
 * @typedef {'initial' | 'loading' | number} LoaderState - 'initial' = not loaded, 'loading' = in progress, number = finished at Date.now()
 * @typedef {Record<Resources, LoaderState>} Loaders
 */

/**
 * @typedef {Object} State
 * @property {Collection[] | null} collections
 * @property {Loaders} loaders - if active, the instance has an active loader
 */

/**
 * @type {State}
 */
export const initialState = {
    collections: null,
    loaders: {
        collections: 'initial',
    },
}
