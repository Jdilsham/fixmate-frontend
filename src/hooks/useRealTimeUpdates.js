import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useRealTimeUpdates = (topic, onRefresh) => {
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL + '/ws-updates'; // Use env var for deployment
    
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: () => {
        console.log(`Connected to topic: ${topic}`);
        client.subscribe(`/topic/${topic}`, (message) => {
          if (message.body === 'REFRESH') {
            onRefresh(); // Call the refresh function passed from the component
          }
        });
      },
      debug: (str) => console.log(str),
    });

    client.activate();
    return () => client.deactivate(); // Cleanup on unmount
  }, [topic, onRefresh]);
};