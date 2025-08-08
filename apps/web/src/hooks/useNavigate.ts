import { useNavigate as useRouterNavigate } from 'react-router-dom';

export const useNavigate = () => {
  const navigate = useRouterNavigate();

  return {
    goTo: (path: string) => navigate(path),
    goBack: () => navigate(-1),
    replace: (path: string) => navigate(path, { replace: true }),
  };
};
