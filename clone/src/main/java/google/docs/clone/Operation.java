package google.docs.clone;


import java.util.List;

public class Operation {
    private int slen;

    private int elen;

    private String source;

    public Operation(int slen, int elen, String source, List<ChangeSet> changeSets) {
        this.slen = slen;
        this.elen = elen;
        this.source = source;
        this.changeSets = changeSets;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    private List<ChangeSet> changeSets;

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

    public List<ChangeSet> getOperationEntities() {
        return changeSets;
    }

    public void setOperationEntities(List<ChangeSet> changeSets) {
        this.changeSets = changeSets;
    }

}