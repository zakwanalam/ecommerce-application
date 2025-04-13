import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useLoadingNavigation(setProgress){
  const navigate = useNavigate()

  const loadingNavigation = (path, query=null,scrollToElement=null) => {
      setProgress(50);
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          navigate(path, { state: query!=null?query:undefined });
          if (scrollToElement) {
            setTimeout(() => {
              document.getElementById(scrollToElement)?.scrollIntoView({behavior:'smooth'})
            }, 1000); 
          }
        }, 1000);
      }, 1000); 
  };

  return loadingNavigation;
}
