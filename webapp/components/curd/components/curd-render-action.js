// eslint-disable-next-line
export default function f (h, { row }) {
    let btns = []
    if (this.updateAction) {
        btns.push(
            <i-button type="success" size="small" class="mr-2" icon="ios-create-outline" onClick={() => this.$$update(row)}>{this.$t('curd.action.update')}</i-button>)
    }
    if (this.deleteAction) {
        btns.push(
            <i-button type="error" size="small" icon="md-trash" onClick={() => this.$$delete([row])}>{this.$t('curd.action.del')}</i-button>)
    }
    return btns
}
