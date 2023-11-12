
import React from 'react';
import { getRefElement } from '../utils/helpers';

export type UseEventListener = {
  type: keyof WindowEventMap;
  listener: EventListener;
  element?: React.RefObject<Element> | Document | Window | null;
  options?: AddEventListenerOptions;
}

export const useEventListener = ({
  type,
  listener,
  element = window,
  options,
}: UseEventListener): void => {
  const savedListener = React.useRef<EventListener>();

  React.useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  const handleEventListener = React.useCallback((event: Event) => {
    savedListener.current?.(event);
  }, []);

  React.useEffect(() => {
    const target = getRefElement(element);
    target?.addEventListener(type, handleEventListener, options);

    return () => target?.removeEventListener(type, handleEventListener);
  }, [type, element, options, handleEventListener]);
};
