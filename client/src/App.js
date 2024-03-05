import React, { useState , useEffect} from 'react';
import { CalFollows, CalNet, GetChanges } from './Utils/Utils';
import io from 'socket.io-client';

function App() {
  const [originalDocument,setOriginalDocument] = useState(null);
  console.log(originalDocument);
  const [sentChanges,setSentChanges] = useState(null);
  const [unsentChanges,setUnSentChanges] = useState(null); 
  const [displayDocument,setDisplayDocument] = useState("");
  const [socket,setSocket] = useState(null);
  console.log(sentChanges , unsentChanges);
  const handleChange = (event) => {
    event.preventDefault();
    const newOperation = GetChanges(displayDocument,event.target.value);
    if(unsentChanges == null){
      setUnSentChanges(newOperation);
    }
    else {
      setUnSentChanges(CalNet(unsentChanges,newOperation));
    }
    setDisplayDocument(event.target.value);
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
      console.log(data);
      if(socket.id == data.id){
         const newOrgDoc = {version : data.version , ...CalNet(originalDocument,sentChanges)};
         setOriginalDocument(newOrgDoc);
         setSentChanges(null);
      }
      else {
        const newOrgDoc = CalNet(originalDocument,data.changes);
        console.log(newOrgDoc);
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
    console.log(data);
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
      console.log(socket.id);
        socket.emit("push-changes",{operation : sentChanges , version: originalDocument.version});
     }
  },[sentChanges,socket]);

  return (
    <div className="App">
      <div className="text-box-container">
        <input
          className="text-box"
          type="text"
          value = {displayDocument}
          onChange={handleChange}
          placeholder="Enter your text here"
        />
      </div>
    </div>
  );
}

export default App;
