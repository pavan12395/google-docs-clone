package google.docs.clone;

public class Insertion implements OperationEntity {
    private String insertStr;

    public Insertion(String insertStr) {
        this.insertStr = insertStr;
    }

    public String getInsertStr() {
        return insertStr;
    }

    public void setInsertStr(String insertStr) {
        this.insertStr = insertStr;
    }
}