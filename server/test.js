const {CalNet,CalFollows,getIndexesRange} = require("./utils");
const assert = require('assert');

const init = {
    slen : 0,
    elen : 6,
    cset : [
        {
            type : "R",start : 0,end : 5
        },
        {
            type : "I",data : "W"
        }
    ]
}

const initIndexes = [{type : "R",content : [0,5,0,5]},{type : "I",content:[6,6,"W"]}];
const insertIndexes = [{type : "R",content : [0,6,0,6]},{type : "I",content:[7,7,"o"]}];

const insert = {
    slen : 6,
    elen : 7,
    cset : [
        {type : "R" , start : 0,end : 6},
        {type : "I",data : "o"}
    ] 
}
const A = {
    slen : 8,
    elen : 10,
    cset : [
        {
            type : "I",
            data : "Hello"
        },
        {
            type : "R",
            start : 0,
            end : 1,
        },{
            type : "I",
            data : "si",
        },{
            type : "R",
            start : 7,
            end : 7
        }
    ]
};

const B = {
    slen : 8,
    elen : 5,
    cset : [
        {
            type : "R",
            start : 0,
            end : 0,
        },
        {
            type : "I",
            data : "e"
        },
        {
            type : "R",
            start : 6,
            end : 6,
        },
        {
            type : "I",
            data : "ow"
        }
    ]
}

const X = {
    slen : 0,
    elen : 5,
    cset : [
        {
            type : "I",
            data : "hello"
        }
    ]
}

const Y = {
    slen : 5,
    elen : 11,
    cset : [
        {
            type : "R",
            start : 0,
            end : 4
        },
        {
            type : "I",
            data : " world"
        }
    ]
}

const Z = {
    slen : 5,
    elen : 5,
    cset : [
        {
            type : "R",
            start : 0,
            end : 0
        },
        {
            type : "I",
            data : "xyz"
        }
    ]
}

// function TestRetentions(){
//     assert.deepStrictEqual(getRetentionIndexesRange([[1,2,5,6],[4,5,7,8],[8,29,9,10]],[1,28],0,2),[[1,2],[4,5],[8,28]]);
//     assert.deepStrictEqual(getRetentionIndexesRange([[1,2]],[1,2],0,0),[[1,2]]);
//     assert.deepStrictEqual(getRetentionIndexesRange([[50,100]],[1,60],0,0),[[50,60]]);
//     assert.deepStrictEqual(getRetentionIndexesRange([[50,100]],[70,130],0,0),[[70,100]]);
//     assert.deepStrictEqual(getRetentionIndexesRange([[1,20],[40,60],[70,100],[150,300]],[30,180],0,3),[[40,60],[70,100],[150,180]]);
// }

// function TestInsertions(){
//     console.log(getInsertionsIndexesRange([[1,2,"hi"],[5,9,"hello"],[10,14,"world"]],[5,11],0,2));
// }

// function TestCalFollows(){
//     console.log(JSON.stringify(CalFollows1(A,B)));
// }

function main(){
    // let temp = CalFollows(A,B);
    // console.log(temp);
    // console.log(JSON.stringify(CalNet(A,temp)));
    console.log(CalNet(init,insert));
    // console.log(getIndexesRange(initIndexes,[0,6],0,initIndexes.length-1));
}

main();

