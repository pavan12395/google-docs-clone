const {Merge,CalNet} = require("./utils");
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
    let ans = Merge(A,B);
    ans = CalNet(X,CalNet(A,ans));
    console.log(ans);
    let ans1 = Merge(B,A);
    ans1 = CalNet(X,CalNet(B,ans1));
    console.log(ans1);
}

function main1(){
    let ans = Merge(Y,Z);
    // console.log(ans);
    ans = CalNet(X,CalNet(Y,ans));
    console.log(ans);
}

main1();