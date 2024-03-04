package google.docs.clone;

import java.util.Iterator;
import java.util.List;

public class ElementIterator implements Iterator<Element> {
    private List<ChangeSet> changeSetList;

    private int localIdx;

    private int changeSetIdx;

    public ElementIterator(List<ChangeSet> changeSets){
        this.changeSetList = changeSets;
    }
    public boolean hasNext(){
        return !(changeSetIdx==changeSetList.size());
    }

    public Element next(){
        ChangeSet changeSet = changeSetList.get(changeSetIdx);
        if(changeSet instanceof InsertionChangeSet){
            InsertionChangeSet insertionChangeSet = (InsertionChangeSet) changeSet;
            Element insertion = new Insertion(insertionChangeSet.getInsertStr().charAt(localIdx));
            this.localIdx = this.localIdx+1;
            if(this.localIdx == insertionChangeSet.getInsertStr().length()){
                this.changeSetIdx +=1;
                this.localIdx = 0;
            }
        }
        else if(changeSet instanceof RetentionChangeSet){
            RetentionChangeSet retentionChangeSet = (RetentionChangeSet) changeSet;

        }
    }
}