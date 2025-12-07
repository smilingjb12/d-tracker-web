import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

export function ScrollToTop() {
  const location = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    window.scroll(0, 0);
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;
