import diff_match_patch from 'diff-match-patch';




export function GetChanges(oldText,newText){
    const cSet = [];
    if(oldText==newText){return null;}
    else{
        const dmp = new diff_match_patch();
        const diff = dmp.diff_main(oldText,newText);
        let idx = 0;
        for(let i=0;i<diff.length;i++){
            if(diff[i][0] == diff_match_patch.DIFF_EQUAL){
                const curr = {type : "R",start : idx,end : idx + diff[i][1].length-1}
                cSet.push(curr);
            }
            else if(diff[i][0] == diff_match_patch.DIFF_INSERT){
                const curr = {type : "I",data : diff[i][1].toString()};
                cSet.push(curr);
            }
            else{
                idx = idx + diff[i][1].length;
            }
        }
        return {slen : oldText.length , elen : newText.length , cset : cSet};
    }
}


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

export function CalFollows(A,B){
    console.log(JSON.stringify(A) + " and "+JSON.stringify(B));
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

export function CalNet(A,B){
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
    let followsOperation = CalFollows(A,B);
    return CalNet(A,followsOperation);
}


function iterate(cset){
    let iterator = new ChangeSetIterator(cset);
    while(iterator.hasNext()){
        console.log(iterator.next());
    }
}
