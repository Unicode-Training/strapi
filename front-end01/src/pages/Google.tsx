import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Google() {
  const location = useLocation();
  useEffect(() => {
    const requestGoogle = async () => {
      const response = await fetch(
        `http://localhost:1337/api/auth/google/callback${location.search}`
      );
      const data = await response.json();
      console.log(data);
    };
    requestGoogle();
  }, []);
  return <div>Google</div>;
}
