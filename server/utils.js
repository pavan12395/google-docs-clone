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
            ans = {type : "D" , totalIndex  : this.totalIdx};
            this.totalIdx = this.totalIdx + 1;
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
            // console.log(this.totalIdx + " and "+this.localIdx);
            if(this.totalIdx  < this.localIdx) {
                ans = {type : "D",index : this.totalIdx};
                this.totalIdx = this.totalIdx + 1;
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

function calFollows(A,B){
    let iterator1 = new ChangeSetIterator(A.cset);
    let iterator2 = new ChangeSetIterator(B.cset);
    let result = [];
    while(iterator1.hasNext() || iterator2.hasNext()){
        let aCSet = iterator1.next();
        let bCSet = iterator2.next();
        if(bCSet.type === "I"){
            pushData(result,{type : "I",data : bCSet.char});
        }
        else if(aCSet.type === "I"){
            pushData(result,{type : "R",start : aCSet.index , end : aCSet.index});
        }
        else if(aCSet.type==="R" && bCSet.type==="R"){
            pushData(result,{type : "R",start : aCSet.index , end : aCSet.index});
        }
    }
    return {
        slen : A.elen,
        elen : calLength(result),
        cset : result
    }
}

function CalNet(A,B){
    let iterator1 = new ChangeSetIterator(A.cset);
    let iterator2 = new ChangeSetIterator(B.cset);
    let result = [];
    while(iterator1.hasNext() || iterator2.hasNext()){
        let aCSet = iterator1.next();
        let bCSet = iterator2.next();
        if(bCSet.type === "I"){
            pushData(result,{type : "I",data : bCSet.char});
        }
        else if(aCSet.type === "I" && bCSet.type !== "D"){
            pushData(result,{type : "I",data : aCSet.char});
        }
        else if(aCSet.type==="R" && bCSet.type==="R"){
            pushData(result,{type : "R",start : aCSet.index , end : aCSet.index});
        }
    }
    return {
        slen : A.slen,
        elen : B.elen,
        cset : result
    }
}

function Merge(A,B){
    let followsOperation = calFollows(A,B);
    return CalNet(A,followsOperation);
}


function iterate(cset){
    let iterator = new ChangeSetIterator(cset);
    while(iterator.hasNext()){
        console.log(iterator.next());
    }
}

module.exports = {Merge,CalNet};