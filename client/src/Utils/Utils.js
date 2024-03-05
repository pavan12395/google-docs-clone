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

export function CalFollows(A,B){
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

export function CalNet(A,B){
    console.log(JSON.stringify(A) + " and "+JSON.stringify(B));
    let iterator1 = new ChangeSetIterator(A.cset);
    let iterator2 = new ChangeSetIterator(B.cset);
    let iteratorOneIndexes = {};
    let result = [];
    while(iterator1.hasNext()){
        const indexObj = iterator1.next();
        iteratorOneIndexes[indexObj.index]  = indexObj;
    }
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
    return {slen : A.slen , elen : length , cset : result};
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