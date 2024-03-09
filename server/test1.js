const {calRetentions,CalFollows} = require("./utils1");

const A = 
{
    slen : 8,
    elen : 5,
    cset : 
    [
        [[0,1],[7,7]],
        [[2,3,"si"]]
    ]   
}

const B = {
    slen : 8,
    elen : 5,
    cset :
    [
        [[0,0],[6,6]],
        [[1,1,"e"],[3,4,"ow"]]
    ]
}

console.log(calRetentions([[0,1],[3,4],[7,8]],[[1,4],[7,8]]));

console.log(JSON.stringify(CalFollows(A,B)));