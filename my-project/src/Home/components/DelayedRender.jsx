import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DelayedRender({delay, children ,setProgress}) {
  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    setProgress(40);
    setTimeout(() => {
      setProgress(100);
      setShouldRender(true);
    }, delay);
  }, [delay]);
  return shouldRender === true ? (
    <>{children}</>
  ) : ''

}

export default DelayedRender;
