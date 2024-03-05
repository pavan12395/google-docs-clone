function calLength(cset){
    let length = 0;
    for(let i=0;i<cset.length;i++){
        if(cset[i].type==="I"){
            length = length + cset[i].data.length;
        }
        else if(cset[i].type==="R"){
            length = length + (cset[i].end-cset[i].start+1);
        }
    }
    return length;
}


class ChangeSetIterator {
    constructor(cset){
        console.log("ChangeSet : ",JSON.stringify(cset));
        this.cset = cset;
        this.localIdx = 0;
        this.csetIdx = 0;
        this.totalIdx = 0;
    }
    updateLocalIdx(){
        let current = this.cset[this.csetIdx];
        if(current.type==="I"){
            this.localIdx = 0;
        }
        else if(current.type==="R"){
            this.localIdx = current.start;
        }
    }
    next(){
        let ans = null;
        if(!this.hasNext())
        {
            return ans;
        }
        let current = this.cset[this.csetIdx];
        if(current.type === "I"){
            ans = {type : "I" , char : current.data.charAt(this.localIdx) , index : this.totalIdx};
            if(this.localIdx == current.data.length - 1){
                this.csetIdx = this.csetIdx + 1;
                if(this.csetIdx < this.cset.length)
                {
                    this.updateLocalIdx();
                    this.totalIdx  = this.totalIdx + 1;
                }
            }
            else {
                this.localIdx++;
                this.totalIdx++;
            }
        }
        else if(current.type === "R"){
             if(this.localIdx > this.totalIdx){
                ans = {type : "D",index : this.totalIdx};
                this.totalIdx++;
                return ans;
             }
             else {
                ans = {type : "R",index : this.totalIdx};
              if(this.localIdx == current.end){
                this.csetIdx = this.csetIdx + 1;
                if(this.csetIdx < this.cset.length){
                    this.updateLocalIdx();
                    this.totalIdx = this.totalIdx + 1;
                }
              }
              else {
                this.localIdx++;
                this.totalIdx++;
            }
             }
              
        }
        return ans;
    }
    hasNext(){
        return this.csetIdx != this.cset.length;
    }
}

function pushData(result,temp){
    if(result.length == 0){
        result.push(temp);
    }
    else{
        let last = result[result.length-1];
        if(last.type !== temp.type){
            result.push(temp);
        }
        else if(last.type==="I"){
            last.data = last.data + temp.data;
        }
        else if(last.type == "R"){
            if(last.end + 1 == temp.start){
                last.end = temp.start;
            }
            else {
                result.push(temp);
            }
        }
    }
}

function CalFollows(A,B){
    let iterator1 = new ChangeSetIterator(A.cset);
    let iterator2 = new ChangeSetIterator(B.cset);
    let result = [];
    let length = 0;
    while(iterator1.hasNext() || iterator2.hasNext()){
        let aCSet = iterator1.next();
        let bCSet = iterator2.next();
        if(bCSet.type === "I"){
            pushData(result,{type : "I",data : bCSet.char});
            length++;
        }
        else if(aCSet.type === "I"){
            pushData(result,{type : "R",start : aCSet.index , end : aCSet.index});
            length++;
        }
        else if(aCSet.type==="R" && bCSet.type==="R"){
            pushData(result,{type : "R",start : aCSet.index , end : aCSet.index});
            length++;
        }
    }
    return {
        slen : A.elen,
        elen : length,
        cset : result
    }
}

function CalNet(A,B){
    console.log(JSON.stringify(A) + " and "+JSON.stringify(B));
    let iterator1 = new ChangeSetIterator(A.cset);
    let iterator2 = new ChangeSetIterator(B.cset);
    let iteratorOneIndexes = {};
    let result = [];
    while(iterator1.hasNext()){
        const indexObj = iterator1.next();
        iteratorOneIndexes[indexObj.index]  = indexObj;
    }
    console.log(JSON.stringify(iteratorOneIndexes));
    let length = 0;
    while(iterator2.hasNext()){
        const current = iterator2.next();
        if(current.type == "D"){continue;}
        else if(current.type == "I"){
            pushData(result , {type : "I",data : current.char});
            length++;
        }
        else if(current.type == "R" && iteratorOneIndexes[current.index] !== void 0){
            const iterator1Obj = iteratorOneIndexes[current.index];
            console.log(iterator1Obj);
            if(iterator1Obj.type=="R"){
                pushData(result , {type : "R",start : current.index , end : current.index});
                length++;
            }
            else if(iterator1Obj.type=="I"){
                pushData(result,{type : "I",data : iterator1Obj.char});
                length++;
            }
        }
    }
    const ans = {slen : A.slen , elen : length , cset : result};
    console.log("Answer " ,JSON.stringify(ans));
    return ans;
}

function Merge(A,B){
    let followsOperation = CalFollows(A,B);
    return CalNet(A,followsOperation);
}


function Iterate(cset){
    let iterator = new ChangeSetIterator(cset);
    while(iterator.hasNext()){
        console.log(iterator.next());
    }
}

module.exports = {Merge,CalNet,CalFollows,Iterate};