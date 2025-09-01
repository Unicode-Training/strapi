import React from "react";

export default function Home() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button
        onClick={() =>
          (window.location.href = "http://localhost:1337/api/connect/google")
        }
      >
        Login with Google
      </button>
      <button
        onClick={() =>
          (window.location.href = "http://localhost:1337/api/connect/github")
        }
      >
        Login with Github
      </button>
    </div>
  );
}
