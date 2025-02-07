import { useMediaQuery } from 'react-responsive';

// Media queries, need to be synced with bootstrap breakpoints
export const useDesktopMediaQuery = () => useMediaQuery({ query: '(min-width: 992px)' });
export const useTabletAndBelowMediaQuery = () => useMediaQuery({ query: '(max-width: 991px)' });

export const Desktop = ({ children }) => {
  const isDesktop = useDesktopMediaQuery();

  return isDesktop ? children : null;
};

export const TabletAndBelow = ({ children }) => {
  const isTabletAndBelow = useTabletAndBelowMediaQuery();

  return isTabletAndBelow ? children : null;
};
