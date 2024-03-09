function CalFollows(A,B){
    let ACset = A.cset;
    let BCset = B.cset;
    let retentions = calRetentions(ACset[0],BCset[0]); 
    for(let i=0;i<ACset[1].length;i++){
        retentions.push([ACset[1][i][0],ACset[1][i][1]]);
    }
    retentions.sort((a, b) => a[0] - b[0]);
    return {slen : A.elen , cset : [retentions,BCset[1]]};
}

function CalNet(A,B){
    let ACset = A.cset;
    let BCset = B.cset;
    let retentions = calRetentions(ACset[0],BCset[0]);
    
}

function calRetentions(retA,retB){
    let idx1 = 0;
    let idx2 = 0;
    let ans = [];
    while(idx1 < retA.length && idx2 < retB.length){
        console.log(idx1,idx2);
        if(retA[idx1][1] >= retB[idx2][1]){
            let common = getCommon(retA[idx1],retB[idx2]);
            if(common != null)
            {
                if(ans.length!=0 && (ans[ans.length-1][1] + 1 == common[0])){ans[ans.length-1][1] = common[1];}
                else{ans.push(common);}
            }
            idx2++;
        }
        else {
            let common = getCommon(retA[idx1],retB[idx2]);
            if(common != null)
            {
                if(ans.length!=0 && (ans[ans.length-1][1] + 1 == common[0])){ans[ans.length-1][1] = common[1];}
                else{ans.push(common);}
            }
            idx1++;
        }
    }
    return ans;
}

function getCommon(A,B){
    let ans = [Math.max(Number(A[0]),Number(B[0])),Math.min(Number(A[1]),Number(B[1]))];
    if(ans[0] > ans[1]){return null;}
    return ans;
}


module.exports = {calRetentions,CalFollows}