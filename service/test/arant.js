/**
 * http://artand.cn/
 * 网站图片 爬取
 */
// let urls = ["/artid/557091", "/artid/557090", "/artid/557089", "/artid/557086", "/artid/557084", "/artid/557083", "/artid/557080", "/artid/557079", "/artid/557077", "/artid/557076", "/artid/557075", "/artid/557074", "/artid/557072", "/artid/557071", "/artid/557070", "/artid/557069", "/artid/557068", "/artid/557066", "/artid/557064", "/artid/557056", "/artid/557054", "/artid/557041", "/artid/557039", "/artid/557037", "/artid/557033", "/artid/556959", "/artid/556957", "/artid/556954", "/artid/556952", "/artid/551771", "/artid/551734", "/artid/551732", "/artid/551731", "/artid/551730", "/artid/551729", "/artid/551728", "/artid/551726", "/artid/551725", "/artid/551724", "/artid/551723", "/artid/551722", "/artid/443497", "/artid/442135", "/artid/439883", "/artid/438736", "/artid/436979", "/artid/432683", "/artid/431074", "/artid/429695", "/artid/429114", "/artid/428614", "/artid/428002", "/artid/427390", "/artid/426741", "/artid/426596", "/artid/426163", "/artid/425728", "/artid/425389", "/artid/424992", "/artid/424127", "/artid/423745", "/artid/423426", "/artid/421442", "/artid/421439"]
// // =>
let keys = [ 'fXR1q6-letqxp3qtg3l2qYqljtq1oramt5-siIqNqZuEh21qt82S17vRf5eaZ5zcj6R_27ih2IS3qpulm3ydaJZ0dmzIpX7asad7bpx5ddqConqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odNruXmsfZyKk3WTdYFoubmhtrm6g5eLopTNmaZ_3baMtWu4mpulm3ydaJZ0dmzIpX7asad7bpx5ddqCjIqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZWox5uzq4-jqGGFqpurxMul1MbNnXuNjJy1hmuP3Ll6rq24hJulm3ydaJZ0dmzIpX7asad7bpx5ddqCjJyh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZ19x4ibnJt6oZmVmo6CupOlubK6ramXr3mTg357vraJsoC1mpulm3ydaJZ0dmzIpX7asad7bpx5ddqCjI6h',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZyxsIm0ZpKiaoOFh46hxreDuLvPpaWHoGm2hmpqvbmL17O-qpulm3ydaJZ0dmzIpX7asad7bpx5ddqCjIqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1or6JtpzOnpyLpXKDiHmuuKiTlbWTnGuHimXUgmqlz7B60IG8qpulm3ydaJZ0dmzIpX7asad7bpx5ddqCfIah',
  'fXR1q6-letqxp3qtg3l2qYqljtq1ociiu4bOZ42hoGORdoakt5R7zL6WoX-DioLZjWuhr7xn1Gy7dJulm3ydaJZ0dmzIpX7asad7bpx5ddqCooKh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZmIt2LKe4V6h3h-naR6s8yClrXQf3yDe4bXlqKlrMdmvqbImpulm3ydaJZ0dmzIpX7asad7bpx5ddqCopKh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odytt3nOqI96sWCTho6lr6mDy7vPh2aIr5zQi6Wd2MafroLIhJulm3ydaJZ0dmzIpX7asad7bpx5ddqCjIqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odxvtnW4momhcqCKqo6Bs7ePqbiVnaKYiXWTiaWL07igyLK3dJulm3ydaJZ0dmzIpX7asad7bpx5ddqCfJKh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oqZuvoe_aI6Ki6qDnX6usJGTur6UimqFe4LOh4-xvbaLroi9qpulm3ydaJZ0dmzIpX7asad7bpx5ddqCsn6h',
  'fXR1q6-letqxp3qtg3l2qYqljtq1orZ8xp7ZaY15g56Km4Z5xpFyt8aog6-JjJSqj4yP0sSguWzJhJulm3ydaJZ0dmzIpX7asad7bpx5ddqConqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oqqBumOwZJqjqZiDeHqVw9udsr26pX6JopOVl7KHuLyhnGq3dJulm3ydaJZ0dmzIpX7asad7bpx5ddqCfKCh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1ocirt5zep4VnrXmEmn6euM6Lsre7oX-QiobWjWql27ihvoS3dJulm3ydaJZ0dmzIpX7asad7bpx5ddqCfKSh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oc9rs4a8rpKhqZqHhX6Vx8-LzrbPoaCDZWnSmGidrLWfum23hJulm3ydaJZ0dmzIpX7asad7bpx5ddqCjIKh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1orqLyGS4apKig6d_dZdltsyc17rNnWqEjKSVln-HrcR5lY25dJulm3ydaJZ0dmzIpX7asad7bpx5ddqConqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1ocivs3m0fI5lj4KCm6dmx8ultrXPg2qYinaXj6adzryKuq26hJulm3ydaJZ0dmzIpX7asad7bpx5ddqCfH6h',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oqqvvGKopY2hfmGTh6yKtZKglMm7i4Wao3KzhqOlyrSIpqvGdJulm3ydaJZ0dmzIpaTasruxboOJeduEeXah',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odimu3jNZYWLoaCVdqSrw5GHqb7NpYyPomm7iH1_3K-MroK5mpulm3ydaJZ0dmzIpaTcsquxboOJeduCr3ah',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oraaspu0jIWKcpaEiKSgxKalsrmre4aEe3q8i3-LtLV6sq2xhJulm3ydaJZ0dmzIpaTbsruxboOJed2EiXah',
  'fXR1q6-letqxp3qtg3l2qYqljtq1ocyLtmG4hYVncqWRhptkr9uHrrHQsGuafHWYhJCH3Mh5vbK2mpulm3ydaJZ0dmzIpaCXs6uxboOJdZeDn3ah',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZ1vsp6fqZuLg3N9qphkvJGTt73df6eMZXaYi5B_xb2I0GmzdJulm3ydaJZ0dmzIpX7asad7bpx5dZODfJKh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1ochtvp6fZougf2V-YHqDuLl6l7C4f2uZimmxiGitl7Zm0KKxqpulm3ydaJZ0dmzIpX7asaePbpx5ddqCfHqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odtut2GsgY96bmSEYKyat8uDzsnOsaOaoXbRmKaSmLeh3KO9hJulm3ydaJZ0dmzIpX7asad7bpx5ddqCjIqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oqartmSolZ2fnWODqp-oxqaTuLLQsWyMZ5eYh3-t0bVm2K7IdJulm3ydaJZ0dmzIpX7asad7bpx5ddqCfJKh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1ormxu4fNqJGvfmSFd5dlxpGDrrnNk6-En5S2hrKDubeMpoXFdJulm3ydaJZ0dmzIpX7asad7bpx5dd2CooKh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZ2oxYe_q4d5h6CFdH5psKd_1be7na2YoJzLj42HlMd3lYi4dJulm3ydaJZ0dmzIpX7asad7bpx5ddqCjIqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZxru5u7qJtlcnqGiJyrt8yxmbfdk4mPZorSmaKc3LF52IrJmpulm3ydaJZ0dmzIpX7asad7bpx5ddqCjKSh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odiMsZ7WgoWKrWWFdWmtvLaTzr6opa2DfGnah42xxbF6uoTFqpulm3ydaJZ0dmzIpX7asad7bpx5ddqCjI6h',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odSOx5zAfJJ6f6R9nWmJsM-HvMipcqSIo5jElmmHr7CKroi-qpulm3ydaJZ0dmzIpX7asad7bpx5dd2CfKCh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oraJsnfAn516k5-EdoqKtZJ_u7m7f5ePiXa1jmqH2LSeqm_FdJulm3ydaJZ0dmzIpX7asad7bpx5dd2Coo6h',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZSxuoisaZKiqap-m4KGxZKL1cfQiq6XZXqqi6KH1rh4yJKxmpulm3ydaJZ0dmzIpX7asad7bpx5dd2Donqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odCtvZ6sn4uNe55-dYKOw6mhp8anoWqJeGGsmaR_zb14vrLHhJulm3ydaJZ0dmzIpX7asad7bpx5dZODso6h',
  'fXR1q6-letqxp3qtg3l2qYqljtq1orp8uZzadpqvpWCIY4qMs5Oprci5g4iDZnrah6WPvL161ISxhJulm3ydaJZ0dmzIpX7asad7bpx5dd2CopKh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1orqjt3ifjIqgfmOUYIVnsM6hk8mopY-XZ2mymn-o3bSKpWzHhJulm3ydaJZ0dmzIpX7asad7bpx5dd2Coo6h',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odtpuZ2se5tlamSHdWl7tJOx1LO3h4GboqS3gn-dzMd7lLOydJulm3ydaJZ0dmzIpX7asad7bpx5ddqCjIqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oqVsxobSnZuig4KRY4qDuaWTqr6Tg3qMiXLbg36Hzblk3K2-dJulm3ydaJZ0dmzIpX7asad7bpx5dd2Csoqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odutxWKfqYd6raeFdX52tsuOmLeUi4aQip_bh49ut7SIuq27hJulm3ydaJZ0dmzIpX7asad7bpx5ddqCjKSh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1ocyTsobOfJufg5aIYJyutcypzsnRoYSIeYrVjo-C3rlnyJK9mpulm3ydaJZ0dmzIpX7asd1_bpx5ddqCfHqh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1orqTtYbWfZuhpZaHeI52xqep27Ooi6CYfIqvmX9y0bqf0Ii2hJulm3ydaJZ0dmzIpX7asad7bpx5ddqCon6h',
  'fXR1q6-letqxp3qtg3l2qYqljtq1orqMvYXAe5J5oaF-dIJ-ts5qqrW7nYOMZYq5go2lq8aiyH69hJulm3ydaJZ0dmzIpX7asad7bpx5ddqCjJKh',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZmvt2KzZYllh4CEnG2Gu7ipsLG5k5eYoYrcg6Nqt8eIzHy3hJulm3yPnpZ4q6vIqbDbst2SZ5x9p9uDsqDc',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oq6Cx520q4mNqXyGhJiLvLepurnNoZCDiXK5gnx_3rV6nbPFhJulm3yPnpZ4q6vIqbDbst2Sr5x9p9uDsqCU',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZ19yXbKiYqjoXWEnH5-tpNt17q6g4OIoIGVg6Oh0MSM0HvFhJulm3yPnpZ4q6vIqbDbst2Srpx9p9uDsqCX',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZ2QtZzei4lli3t_eJtosKmT1sWTk62bfYKmg4yD07ihto7GdJulm3yPnpZ4q6vIqbDcsd2Or5x9p9yCsqCZ',
  'fXR1q6-letqxp3qtg3l2qYqljtq1ocixvnbajYuff32VhHaouJOducWpg2iajJjTmaSdmrdlspO2qpulm3yPnpZ4q6vIqbDbsqeKaZx9p9yCjJyU',
  'fXR1q6-letqxp3qtg3l2qYqljtq1orKKvpyfgpKhnaWFhpyLuLdxlcm6raqXoIGVmqaptr2usqGympulm3yPnpZ4q6vIqbDbsqeOZ5x9p9yCjJLd',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odCtvmTNqId6naGGnaCsupR_scaVsK6NoYKul6WTscSf3KHJhJulm3yPnpZ4q6vIqbDbss2CaJx9p9yDfIqY',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oduxuZyfpZmvh3-DnHqExbZ_0bOoj3mXr3K9j45y18iJzI3FhJulm3yPnpZ4q6vIqbDcsqeKapx9p9uDooLe',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oqpvsXbRZ4aLqKqBiIZ7w7mg2saUnWmLoXnalrKTlbegpom5mpulm3yPnpZ4q6vIqbDbsqeKa5x9p9yCjJze',
  'fXR1q6-letqxp3qtg3l2qYqljtq1or6MvWPOd4SMraR9dqCpt86tqLe4qYuJeZjUi2uL17CKy7O9mpulm3yPnpZ4q6vIqbDbss1-rZx9p9yDfIqY',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odSDvmS0aIqfpZ-DiIlmuLWH3LyWi7CJfYquj4CClLKMyJ-1mpulm3yPnpZ4q6vIqbDcsbekZ5x9p9uDfIbe',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oq6NtYm8oo97nZaGnWWMtKeTl7ndpYKQZYbbh6Z73L13lYmxhJulm3yPnpZ4q6vIqbDcsbegZ5x9p9uDfIrb',
  'fXR1q6-letqxp3qtg3l2qYqljtq1ocilyYewiZ2KqGCFYp-tvLV7mLnOf6-EZ36pgn2O3rF8rrO4mpulm3yPnpZ4q6vIqbDbsrekaJx9p9yDfIqY',
  'fXR1q6-letqxp3qtg3l2qYqljtq1or6uu4fKhJ19i36ThYaMx7Zp2reWpLCEoJSniH2puryurbK6qpulm3yPnpZ4q6vIqbDbss1-aZx9p9yDfIqY',
  'fXR1q6-letqxp3qtg3l2qYqljtq1ocyfx4nWiouMpZmCYoqGrriH0sXNgmuaZ6OWmI-PsLSItWu4mpulm3yPnpZ4q6vIqbDbsqeKZ5x9p9yCjJyY',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oqVuuZ2wqJFog5yUYHqfttuL3MWoba6XfaCWmICdp7hlrWm2mpulm3yPnpZ4q6vIqbDcsbeSZ5x9p9uDfI6U',
  'fXR1q6-letqxp3qtg3l2qYqljtrFfK6vvmTRZ4VoqaGVdX6pw6itqca5eq-HZnbbmX-D1sZksm7IhJulm3yPnpZ4q6vIqbDcsd2OsJx9p9yCspyU',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZhpx3W8q4Wgi4WHeJ-tuaehvbvPg4yNjZPamH1tl7dnyLO8qpulm3yPnpZ4q6vIqbDbst2Oapx9p9uDsqCZ',
  'fXR1q6-letqxp3qtg3l2qYqljtq1or6suJvKp5Khf3yHnaRmsKeL07rQh4yZoXaXin-pvr2fyIu-dJulm3yPnpZ4q6vIqbDbsqeGsJx9p9yCjKSV',
  'fXR1q6-letqxp3qtg3l2qYqljtq1odCJuXiWZJKMf4F_dYqBu5Odk8eWf6-XjZylj32L2Ldm0G-ydJulm3yPnpZ4q6vIqbDcsqeKapx9p9uDooaW',
  'fXR1q6-letqxp3qtg3l2qYqljtq1orJ7sZ20d4-Kg4qTYYadw8-H17bcaqWDe5eWho-Lr72i1IbJhJulm3yPnpZ4q6vIqbDbsqeKaZx9p9yCjJyU',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oZ2ixYjdZYV5f3-KeHqpt5SLtbrOi62HZ2WUgn2xurp5sqK2hJulm3yPnpZ4q6vIqbDbss2OZ5x9p9yDfIqY',
  'fXR1q6-letqxp3qtg3l2qYqljtq1oq6EvZzWjYpnrWGCdHpqw6eDz7uqjqqEZZjdmpCLmLF727C-hJulm3yPnpZ4q6vIqbDbsqeOsJx9p9yCjJKV' ]
//
//
//
var http = require("http");
var cheerio = require("cheerio");
var fs = require('fs')
var path = require("path");
//
//
let test = [];
for(let i = 0,l = keys.length;i<=l;i++){
    // let url = `http://dn-coding-net-production-avatar.qbox.me/Fruit-${i}.png?imageMogr2/thumbnail/128`
    // let url = urls[i]

    let options = {
        host: 'artand.cn',
        port:80,
        path:'/public/pyramid?pid='+keys[i],
        method: 'GET',
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
        }
    };
    test.push(getSize(options,i))

    
    // let options = {
    //     host: 'artand.cn',
    //     port:80,
    //     path:urls[i],
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'text/html; charset=utf-8',
    //         "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
    //     }
    // };
    // test.push(getK(options))


        // var imgData="";
        // res.setEncoding("binary");
        // res.on("data",function(chunk){
        //     imgData += chunk;
        // });
        // res.on("end",function(){
        //     fs.writeFile(path.join(__dirname , "coding-avatar",`avatar-${i}.png`),imgData,"binary",function(err,c){
        //         // console.log(err);
        //         if(err){
        //             console.log(err);
        //         }
        //     })
        // })

}
Promise.all(test).then(ccc =>{
    console.log(ccc)
})

function getSize(options,index){
    return new Promise(function (resolve, reject){
        http.get(options,function(res){
            let html = "";
            res.on("data", function (chunk) {
                html += chunk;
            });
            res.on("end", function () {
                //
                let data = JSON.parse(html)
                url = data.levels[0].url

                // let url = `https://dn-coding-net-production-avatar.qbox.me/Fruit-${i}.png`
                http.get(url,function(res){
                    var imgData="";
                    res.setEncoding("binary");
                    res.on("data",function(chunk){
                        imgData += chunk;
                    });
                    res.on("end",function(){
                        fs.writeFile(path.join(__dirname , "aaaa",index+".png"),imgData,"binary",function(err,c){
                            if(err){
                                console.log(err);
                            }
                        })
                    })

                })
            })
        });
    })
}

function getK(options){
    return new Promise(function (resolve, reject){
        http.get(options,function(res){
            let html = "";
            res.on("data", function (chunk) {
                html += chunk;
            });
            res.on("end", function () {

                var $ = cheerio.load(html);
                resolve($('#large_img').attr("data-key"))
            })
        });
    })
}


//

//
//
