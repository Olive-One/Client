import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * @description - Scroll to top of the page when route changes
 * @param children  - ReactNode
 * @param scrollableDivRef - React.RefObject<HTMLDivElement>
 * @returns  - ReactNode
 */

const ScrollToTop = ({ children, scrollableDivRef }: { children: React.ReactNode; scrollableDivRef: React.RefObject<HTMLDivElement | null> }) => {
	const location = useLocation();

	useEffect(() => {
		if (scrollableDivRef.current) {
			scrollableDivRef.current.scrollTop = 0;
		}
	}, [location, scrollableDivRef]);

	return <>{children}</>;
};

export default ScrollToTop;
