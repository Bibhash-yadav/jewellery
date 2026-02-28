import { useEffect, useRef, useState } from "react";

export default function useNotifications() {

  const [notifications,setNotifications] = useState<any[]>([]);
  const [unread,setUnread] = useState(0);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(()=>{

    const token = localStorage.getItem("token");
    if(!token) return;

    // close old socket if exists
    if(socketRef.current){
      socketRef.current.close();
    }

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications?token=${token}`);
    socketRef.current = ws;

    ws.onopen = ()=>{
      console.log("🔌 WS connected");
    };

    ws.onmessage = (event)=>{
      const data = JSON.parse(event.data);

      let title = "";
      let message = "";

      switch(data.type){

        case "PRODUCT_CREATED":
          title = "New Product";
          message = `${data.title} added`;
          break;

        case "PRODUCT_UPDATED":
          title = "Product Updated";
          message = `${data.title} updated`;
          break;

        case "PRODUCT_DELETED":
          title = "Product Removed";
          message = `${data.title} removed`;
          break;

        case "ORDER_STATUS":
          title = "Order Update";
          message = `Order #${data.order_id} is ${data.status}`;
          break;

        default:
          title = "Notification";
          message = "New update available";
      }

      setNotifications(prev=>[{title,message,date:new Date()},...prev]);
      setUnread(prev=>prev+1);
    };

    ws.onclose = ()=>{
      console.log("❌ WS closed");
    };

    return ()=>{
      ws.close();
    };

  }, [localStorage.getItem("token")]); // ⭐ IMPORTANT

  const markRead=()=>setUnread(0);

  return {notifications,unread,markRead};
}