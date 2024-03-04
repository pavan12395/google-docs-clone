package google.docs.clone;

public class Insertion implements Element {
    Character content;

    public Character getContent() {
        return content;
    }

    public void setContent(Character content) {
        this.content = content;
    }

    public Insertion(Character content){
        this.content = content;
    }
}