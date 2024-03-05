const { CalFollows, CalNet } = require('./utils');

const io = require('socket.io')(8080)


let socketIdsMap = {};
let operationSet = [];
let document = {slen : 0,elen : 5 , cset : [{type : "I",data : "Hello"}] ,version : "0"};
console.log(document);
let revisionLog = {0 : document};


io.on("connection",(socket)=>
{
    console.log("Connected to a client");
    socketIdsMap[socket.id] = socket;
    socket.emit("initDoc",document);
    socket.on("push-changes",(data)=>{
        console.log(data);
        const currentOperation = {clientId : socket.id , operation : data.operation , version : data.version};
        console.log("Current Operation pushed : ",JSON.stringify(currentOperation));
        operationSet.push(currentOperation);
        console.log(JSON.stringify(operationSet));
    })
});

function calculateCorrectOperation(operation , version){
    console.log("Operation : ",JSON.stringify(operation));
    let correctOperation = operation;
    let currentVersion = BigInt(document.version);
    let assumedVersion = BigInt(version);
    console.log(currentVersion + " and "+assumedVersion);
    for(let v = currentVersion ; v > assumedVersion  ; v--){
        console.log("Current Rev Log : ",JSON.stringify(revisionLog[v.toString()]));
        correctOperation = CalFollows(revisionLog[v.toString()],correctOperation);
    }
    return correctOperation;
}

function applyOperations(){
    for(let i=0;i<operationSet.length;i++){
        const currentOperation = operationSet[i].operation;
        const currentVersion = operationSet[i].version;
        const correctOperation = calculateCorrectOperation(currentOperation,currentVersion);
        console.log("Correct Operation  : ",JSON.stringify(correctOperation));
        const newDocument = CalNet(document,correctOperation);
        newDocument.version = (BigInt(document.version) + BigInt("1")).toString();
        document = newDocument;
        revisionLog[newDocument.version] = correctOperation;
        const ackChangeResponse = {id : operationSet[i].clientId , changes : correctOperation , version : newDocument.version};
        console.log(JSON.stringify(ackChangeResponse));
        console.log("Document : ",JSON.stringify(document));
        io.emit("ack-changes",ackChangeResponse);
        operationSet.shift();
    }
}


setInterval(applyOperations,1000);