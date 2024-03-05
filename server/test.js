const {Merge,CalNet,Iterate,CalFollows} = require("./utils");
const A = {
    slen : 8,
    elen : 5,
    cset : [
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
    console.log(CalNet(A,CalFollows(A,B)));
}

function main1(){
    // const S = {slen : 0 , elen : 5,cset : [{type : "I",data : "world"}]};
    // Iterate(B.cset);
    Iterate(A.cset);
    console.log("*******");
    Iterate(B.cset);
    console.log(CalFollows(A,B));
}

main();