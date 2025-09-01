import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Github() {
  const location = useLocation();
  useEffect(() => {
    const requestGithub = async () => {
      const response = await fetch(
        `http://localhost:1337/api/auth/github/callback${location.search}`
      );
      const data = await response.json();
      console.log(data);
    };
    requestGithub();
  }, []);
  return <div>Google</div>;
}
