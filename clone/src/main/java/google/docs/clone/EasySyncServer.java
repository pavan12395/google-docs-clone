package google.docs.clone;


import java.util.ArrayList;
import java.util.List;

public class EasySyncServer {
    public Operation compute(Operation a,Operation b) throws  Exception {
        if(a.getElen() != b.getSlen()){
            throw new Exception("Operations cannot be applied");
        }
        List<OperationEntity> aOperationEntities = a.getOperationEntities();
        List<OperationEntity> bOperationEntities = b.getOperationEntities();
        int aEntitySize = aOperationEntities.size();
        int bEntitySize = bOperationEntities.size();
        int a_idx = 0;
        int b_idx = 0;
        int a_local_idx = -1;
        int b_local_idx = -1;
        int a_entity = 0;
        int b_entity = 0;
        OperationEntity currEntity = null;
        List<OperationEntity> targetOperationEntities = new ArrayList<>();
        while(a_entity<aEntitySize && b_entity<bEntitySize){
            OperationEntity aEntity = aOperationEntities.get(a_entity);
            OperationEntity bEntity = bOperationEntities.get(b_entity);
            if((aEntity instanceof Retention) && (bEntity instanceof Retention)){
                if(a_local_idx==-1){a_local_idx=a;}
                if(b_local_idx==-1){b_local_idx=0;}

            }
            else if((aEntity instanceof Insertion) && (bEntity instanceof Insertion)){

            }
        }
    }
    public Operation merge(Operation a,Operation b){

    }
}