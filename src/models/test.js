const {termDao, postDao, postMetaDao, sequelize} = require('./index')
const {Enum} = require('../common/enum')
const Op = sequelize.Op;
// termDao.findAll({
//     attributes: ['name'],
//     where:{
//         taxonomy: Enum.TaxonomyEnum.POST_TAG,
//         id:{[Op.in]: [1,3,30,27]}
//     }
// }).then((aa)=>{
//     console.log(aa)
// })

const queryCategorySticky = `
SELECT id FROM j_posts WHERE id IN (SELECT object_id FROM \`j_postmeta\` AS \`postMeta\` 
	LEFT JOIN \`j_term_relationships\` AS jtr ON jtr.\`object_id\` = postMeta.\`post_id\`
	LEFT JOIN \`j_terms\` AS jt ON jt.\`id\` = jtr.\`term_id\`
	WHERE \`postMeta\`.\`meta_key\` = 'sticky' AND \`postMeta\`.\`meta_value\` = '1' AND jt.\`slug\`=?)
	ORDER BY post_date DESC
	LIMIT 0, ?;`;

(async function () {
    // let a = await postMetaDao.findOrCreate({
    //     where:{
    //         post_id: 90,
    //         meta_key: 'tags'
    //     },
    //     defaults: {
    //         meta_value: '22222222222222222'
    //     }
    // })

     let result =  await sequelize.query(queryCategorySticky,
        {type: sequelize.QueryTypes.SELECT, replacements: ['uncategorized', 3]})
    let o = result[0]

    console.log('result= ', result )
    console.log(o.user)
    console.log(JSON.stringify({a: Op.in}))

})()
// postDao.findById(98).then(async (post)=>{
//     let o = await post.getMetas()
//     let o1 = o[1]
//     // let c = await post.hasMeta('1')
//     // let c = await post.addMeta('2222', {
//     //     meta_value: 3123
//     // })
//     // console.log(o.length, c)
// })

// getUser: [Function],
//     setUser: [Function],
//     createUser: [Function],
//     getMetas: [Function],
//     countMetas: [Function],
//     hasMeta: [Function],
//     hasMetas: [Function],
//     setMetas: [Function],
//     addMeta: [Function],
//     addMetas: [Function],
//     removeMeta: [Function],
//     removeMetas: [Function],
//     createMeta: [Function],
//     getTerms: [Function],
//     countTerms: [Function],
//     hasTerm: [Function],
//     hasTerms: [Function],
//     setTerms: [Function],
//     addTerm: [Function],
//     addTerms: [Function],
//     removeTerm: [Function],
//     removeTerms: [Function],
//     createTerm: [Function] }

