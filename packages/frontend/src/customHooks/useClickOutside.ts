import React from 'react';
import { getRefElement } from '../utils/helpers';
import { useEventListener } from './useEventListener';

export const useClickOutside = (
  element: React.RefObject<Element> | null,
  callback: (event: MouseEvent) => void,
): void => {
  const handleClick = React.useCallback((event) => {
    if (!getRefElement(element)?.contains(event.target)) {
      callback(event);
    }
  }, [callback, element]);

  useEventListener({
    type: 'click',
    listener: handleClick,
  });
};
