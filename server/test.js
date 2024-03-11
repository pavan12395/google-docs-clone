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

function main(){
    console.log(CalNet(init,insert));
}

main();

