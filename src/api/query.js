export const query = (path, params = undefined) => {
    if (!params) return path
    const searchParams = new URLSearchParams(params)
    return `${path}?${searchParams.toString()}`
}
