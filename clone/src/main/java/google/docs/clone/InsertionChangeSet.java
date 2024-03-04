package google.docs.clone;

public class InsertionChangeSet implements ChangeSet {
    private String insertStr;

    public InsertionChangeSet(String insertStr) {
        this.insertStr = insertStr;
    }

    public String getInsertStr() {
        return insertStr;
    }

    public void setInsertStr(String insertStr) {
        this.insertStr = insertStr;
    }
}