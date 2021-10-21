import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from 'react-query'

const context = createContext({});

export const useSocketPush = ([event, payload = {}], options) => {
  const root = useContext(context);

  const pushEvent = ({queryKey: [event, payload]}) => new Promise((resolve) => {
    root.pushEvent(event, payload, (reply) => resolve(reply));
  });

  return useQuery([event, payload], pushEvent, options);
};

export const useSocketHandle = (event, initialState) => {
  let ref = 0;
  const [response, setResponse] = useState(initialState);
  const root = useContext(context);

  useEffect(() => {
    const callbackRef = root.handleEvent(event, ({data}) => {
      ref += 1;
      setResponse(data);
    });
    return () => root.removeHandleEvent(callbackRef);
  }, [event]);

  return [response, ref];
};

export const Provider = context.Provider;
