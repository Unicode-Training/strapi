import React, { useEffect } from "react";

export default function Demo() {
  useEffect(() => {
    const getPost = async () => {
      const response = await fetch(
        `https://strapi.topcoin.pro/api/test/posts`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            data: {
              Title: "Xin chào anh em",
              Content: "Xin chào anh em",
              ShowHome: true,
              Type: "new",
            },
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    };
    getPost();
  }, []);
  return <div>Demo</div>;
}
