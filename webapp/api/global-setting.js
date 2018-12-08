import api from './index'

export function getWebSiteSetting () {
    return api.nget('/api/site/dict')
}

export function updateWebSiteSetting (site) {
    return api.npost('/api/site/update', site)
}

export function fetchAll () {
    return api.nget('/api/site/statistics')
}
