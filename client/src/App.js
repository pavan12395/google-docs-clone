import React, { useState , useEffect} from 'react';
import { CalFollows, CalNet, GetChanges } from './Utils/Utils';
import io from 'socket.io-client';
import Document from './Document';

function App() {
  const [originalDocument,setOriginalDocument] = useState(null);
  const [sentChanges,setSentChanges] = useState(null);
  const [unsentChanges,setUnSentChanges] = useState(null); 
  const [displayDocument,setDisplayDocument] = useState("");
  const [socket,setSocket] = useState(null);
 const [pages, setPages] = useState([]);
  const handleChange = (event) => {
    event.preventDefault();
    const newOperation = GetChanges(displayDocument,event.target.value);
    console.log(newOperation);
    if(unsentChanges == null){
      setUnSentChanges(newOperation);
    }
    else {
      const newUnsentChanges = CalNet(unsentChanges,newOperation);
      console.log("New Operation : ",newOperation , "new Unsent Changes : ",newUnsentChanges);
      setUnSentChanges(newUnsentChanges);
    }
    setDisplayDocument(event.target.value);
    const newPages = event.target.value.match(/.{1,500}/g);
    setPages(newPages);
  };

  useEffect(()=>{
    const newSocket = io('http://localhost:8080',{ transports : ["websocket"] });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect(); // Disconnect on component unmount
    };
  },[]);

 useEffect(() => {
  console.log("Original Document:", JSON.stringify(originalDocument, null, 2));
  console.log("Sent Changes:", JSON.stringify(sentChanges, null, 2));
  console.log("Unsent Changes:", JSON.stringify(unsentChanges, null, 2));
  console.log("Display Document:", JSON.stringify(displayDocument, null, 2));
}, [originalDocument, sentChanges, unsentChanges, displayDocument]);

  useEffect(()=>{
    if(socket!=null){
    const ackChangesHandler = (data)=>{
      if(socket.id == data.id){
         const newOrgDoc = {version : data.version , ...CalNet(originalDocument,sentChanges)};
         setOriginalDocument(newOrgDoc);
         setSentChanges(null);
      }
      else {
        console.log("OtherSocket : Recieved Changes : ",JSON.stringify(data.changes),JSON.stringify(originalDocument));
        const newOrgDoc = CalNet(originalDocument,data.changes);
        newOrgDoc.version = data.version;
        if(sentChanges == null){
          setOriginalDocument(newOrgDoc);
          setDisplayDocument(newOrgDoc.cset[0].data);
        }
        else if(sentChanges!=null){
          const newSentChanges = CalFollows(data.changes,sentChanges);
          setSentChanges(newSentChanges);
          if(unsentChanges != null){
            const newUnsentChanges = CalFollows(CalFollows(sentChanges,data.changes),unsentChanges);
            setUnSentChanges(newUnsentChanges);
            const newDisplayDocument = CalNet(newOrgDoc,CalNet(newSentChanges,newUnsentChanges)).cset[0].data;
            setOriginalDocument(newOrgDoc);
            setDisplayDocument(newDisplayDocument.cset[0].data);
          }
          else {
            const newDisplayDocument = CalNet(newOrgDoc,newSentChanges);
            setOriginalDocument(newOrgDoc);
            setDisplayDocument(newDisplayDocument.cset[0].data);
          }
        }
      }
   };
   const initDocHandler = (data)=>{
     setOriginalDocument(data);
     setDisplayDocument(data.cset[0].data);
   }
       socket.on("ack-changes",ackChangesHandler);
       socket.on("initDoc",initDocHandler);
    return ()=>{
      socket.off("ack-changes",ackChangesHandler);
      socket.off("initDoc",initDocHandler);
    }
  }
  },[socket,sentChanges,originalDocument]);

  useEffect(()=>{
    if(sentChanges == null){
       setSentChanges(unsentChanges);
       setUnSentChanges(null);
    }
  },[sentChanges,unsentChanges]);

  useEffect(()=>{
     if(sentChanges != null && socket!=null){
        socket.emit("push-changes",{operation : sentChanges , version: originalDocument.version});
     }
  },[sentChanges,socket]);

  return (
    <div className="text-box-container">
      <Document displayDocument={displayDocument} handleChange={handleChange} pages={pages}/>
    </div>
  );
}

export default App;
