// eslint-disable-next-line
export default function f (h, {row}) {

	let edit = <i-button type="success" size="small" class="mr-2" icon="ios-create-outline" onClick={()=> this.update(row)}>{this.$t('curd.action.update')}</i-button>
	let del = <i-button type="error" size="small" icon="md-trash" onClick={()=> this.del([row])}>{this.$t('curd.action.del')}</i-button>
	//     <Button type="warning">Warning</Button>
	//     <Button type="">Error</Button>
	return [edit, del]
}