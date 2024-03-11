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
    let resultCset = [];
    let aRetentions = [];
    let Aidx = 0;
    for(let i=0;i<A.cset.length;i++){
        if(A.cset[i].type === "R"){
            aRetentions.push({type : "R" , content : [A.cset[i].start,A.cset[i].end , Aidx , Aidx + (A.cset[i].end - A.cset[i].start)]});
        }
        else {
            Aidx += A.cset[i].data.length;
        }
    }
    let idx = 0;
    Aidx = 0;
    let resultLength = 0;
    let initAidx = 0;
    while(initAidx < A.cset.length && A.cset[initAidx].type === "I"){
        let currentRetention = {type : "R",start : Aidx , end : Aidx + A.cset[idx].data.length-1};
        pushData(resultCset,currentRetention);
        Aidx = currentRetention.end + 1;
        resultLength+=A.cset[initAidx].data.length;
        initAidx++;
    }
    while(idx < B.cset.length){
        let current = B.cset[idx];
        if(current.type == "I"){
            pushData(resultCset,current);
            resultLength+=current.data.length;
        }
        else if(current.type == "R"){
            let indexRanges = getIndexesRange(aRetentions,[current.start,current.end],0,aRetentions.length-1);
            for(let i=0;i<indexRanges.length;i++){
                resultLength+=(indexRanges[i][1]-indexRanges[i][0]+1);
                pushData(resultCset,indexRanges[i]);
            }
        }
        if(initAidx <= idx && idx < A.cset.length){
            let current = A.cset[idx];
            if(current.type === "R"){
                Aidx = Aidx + (current.end-current.start+1);
            }
            else {
                let currentRetention = {type : "R" , start : Aidx  , end : Aidx + A.cset[idx].data.length-1};
                resultLength+=(A.cset[idx].data.length);
                pushData(resultCset , currentRetention);
                Aidx = currentRetention.end + 1;
            }
        }
        idx++;
    }
    while(initAidx <= idx && idx < A.cset.length){
        let current = A.cset[idx];
        if(current.type === "R"){
            Aidx = Aidx + (current.end-current.start+1);
        }
        else {
            let currentRetention = {type : "R" , start : Aidx  , end : Aidx + A.cset[idx].data.length-1};
            resultLength+=(A.cset[idx].data.length);
            pushData(resultCset , currentRetention);
            Aidx = currentRetention.end + 1;
        }
        idx++;
    }
    return {slen : A.elen , elen : resultLength,cset : resultCset};
}

function CalNet(A,B){
    let Aindexes = [];
    let Aidx = 0;
    for(let i=0;i<A.cset.length;i++){
        if(A.cset[i].type === "R"){
            let length = (A.cset[i].end - A.cset[i].start + 1);
            let current = {type : "R" , content : [Aidx , Aidx + length-1,A.cset[i].start,A.cset[i].end]};
            Aindexes.push(current);
            Aidx+=length;
        }
        else{
            console.log("ACSET : ",A.cset[i]);
            Aindexes.push({type : "I" , content : [Aidx , Aidx + String(A.cset[i].data).length-1,A.cset[i].data]});
            Aidx+=(String(A.cset[i].data).length);
        }
    }
    let resultCset = [];
    for(let i=0;i<B.cset.length;i++){
        if(B.cset[i].type === "R"){
            let current = [B.cset[i].start,B.cset[i].end];
            let getIndex = getIndexesRange(Aindexes,current,0,Aindexes.length-1);
            for(let k=0;k<getIndex.length;k++){pushData(resultCset,getIndex[k]);}
        }
        else {
            pushData(resultCset,B.cset[i]);
        }
    }
    if(resultCset.length == 0){
        return {slen : A.slen , elen : B.elen , cset : [{type : "I",data : ""}]};
    }
    return {slen : A.slen , elen : B.elen , cset : resultCset};
}
function Merge(A,B){
    let followsOperation = CalFollows(A,B);
    return CalNet(A,followsOperation);
}

function getIndexesRange(set,current,s,e){
    let ans = [];
    console.log("SET : ",set);
    while(s<=e){
        let mid = Math.floor((s+e)/2);
        let resultLeftRange = 0;
        let resultRightRange = 0;
        let resultLeftIndex = 0;
        let resultRightIndex = 0;
        let content = set[mid].content;
        console.log(content);
        if(set[mid].type === "I"){
            resultLeftIndex = (current[0]-content[0]);
            resultRightIndex = resultLeftIndex + (current[1]-current[0]);
        }
        else {
            resultLeftRange = (current[0]-content[0])+content[2];
            resultRightRange = content[3] - (content[1]-current[1]);
        }
        if(content[0] <= current[0] && current[0]<=content[1]){
            if(current[1] > content[1]){
                if(set[mid].type === "I"){
                    ans.push({type : "I",data : content[2].substring(resultLeftIndex , content[2].length)});
                }
                else {
                    let result = {type : "R" , start : resultLeftRange,end : content[3]};
                    ans.push(result);
                }

                s = mid+1;
                current = [content[1] + 1 , current[1]];
            }
            else {
                if(set[mid].type === "I") {
                    ans.push({type : "I",data : content[2].substring(resultLeftIndex,resultRightIndex+1)});
                }
                else {
                    ans.push({type : "R" , start : resultLeftRange,end : resultRightRange});
                }
                return ans;
            }
        }
        else if(content[0] <= current[1] && current[1]<=content[1]){
            if(current[0] < content[0]){
                let result = null;
                if(set[mid].type === "I"){
                    result = {type : "I" , data : content[2].substring(0,resultRightIndex+1)};
                }
                else {
                    result = {type : "R" , start : content[2],end : resultRightRange};
                }
                current = [current[0],content[0]-1];
                ans = [...ans , ...getIndexesRange(set,current,s,mid-1)];
                ans.push(result);
                return ans;
            }
            else {
                if(set[mid].type === "I"){
                    ans.push({type : "I",data : content[2].substring(resultLeftIndex,resultRightIndex+1)});
                }
                else {
                    ans.push({type : "R" , start : resultLeftRange,end : resultRightRange});
                }
                return ans;
            }
        }
        else if(content[0] > current[0] && content[1] < current[1]){
            let left = getIndexesRange(set,[current[0],content[0]-1],s,mid-1);
            if(left.length != 0){
                ans = [...left , ...ans];
            }
            if(set[mid].type === "I"){
            ans.push({type : "I",data : content[2].substring(resultLeftIndex,resultRightIndex+1)});
            }
            else {
            ans.push({type : "R",start : content[2],end : content[3]});
            }
            let right = getIndexesRange(set,[content[1]+1,current[1]],mid+1,e);
            if(right.length != 0){
                ans = [...ans , ...right];
            }
            return ans;
        }
        else if(content[0] > current[1]){
            e = mid-1;
        }
        else {
            s =  mid+1;
        }
    }
    return ans;
}
module.exports = {Merge,CalNet,CalFollows};