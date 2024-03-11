const { CalFollows, CalNet } = require('./utils');

const io = require('socket.io')(8080)

let operationSet = [];
let document = {slen : 0,elen : 0 , cset : [{type : "I",data : ""}] ,version : "0"};
let revisionLog = {0 : document};


io.on("connection",(socket)=>
{
    socket.emit("initDoc",document);
    socket.on("push-changes",(data)=>{
        const currentOperation = {clientId : socket.id , operation : data.operation , version : data.version};
        operationSet.push(currentOperation);
    })
});

function calculateCorrectOperation(operation , version){
    let correctOperation = operation;
    let currentVersion = BigInt(document.version);
    let assumedVersion = BigInt(version);
    for(let v = currentVersion ; v > assumedVersion  ; v--){
        correctOperation = CalFollows(revisionLog[v.toString()],correctOperation);
    }
    return correctOperation;
}

function applyOperations(){
    for(let i=0;i<operationSet.length;i++){
        const currentOperation = operationSet[i].operation;
        const currentVersion = operationSet[i].version;
        const correctOperation = calculateCorrectOperation(currentOperation,currentVersion);
        const newVersion = (BigInt(document.version) + BigInt("1")).toString();
        const ackChangeResponse = {id : operationSet[i].clientId , changes : correctOperation , version : newVersion};
        io.emit("ack-changes",ackChangeResponse);
        const newDocument = CalNet(document,correctOperation);
        newDocument.version = newVersion;
        document = newDocument;
        revisionLog[newDocument.version] = correctOperation;
        operationSet.shift();
    }
}


setInterval(applyOperations,1000);