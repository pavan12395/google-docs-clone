package google.docs.clone;


import java.util.List;

public class Operation {
    private int slen;

    private int elen;

    private String source;

    public Operation(int slen, int elen, String source, List<OperationEntity> operationEntities) {
        this.slen = slen;
        this.elen = elen;
        this.source = source;
        this.operationEntities = operationEntities;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    private List<OperationEntity> operationEntities;

    public int getSlen() {
        return slen;
    }

    public void setSlen(int slen) {
        this.slen = slen;
    }

    public int getElen() {
        return elen;
    }

    public void setElen(int elen) {
        this.elen = elen;
    }

    public List<OperationEntity> getOperationEntities() {
        return operationEntities;
    }

    public void setOperationEntities(List<OperationEntity> operationEntities) {
        this.operationEntities = operationEntities;
    }

}