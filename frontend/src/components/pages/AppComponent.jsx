import { useLocation } from "react-router-dom";

const AppContent = () => {
  const location = useLocation();

  const hideFloating = ["/srj/admin/login", "/srj/panel/dashboard"];

  const shouldHide = hideFloating.includes(location.pathname);

  return (
    <>
      <ScrollToTop />

      {!shouldHide && <FloatingContact />}

      <Routes>{/* all routes */}</Routes>
    </>
  );
};
