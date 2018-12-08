import api from './index'

export function getQQInfo (qq) {
    return api.nget(`/api/tools/qinfo`, { key: qq })
}
