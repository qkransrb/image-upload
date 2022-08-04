import React, { useContext } from "react";
import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
  const [images] = useContext(ImageContext);

  return (
    <div>
      <h3>이미지 리스트</h3>
      {images &&
        images.map((image) => (
          <img
            key={image.key}
            src={`http://localhost:5000/uploads/${image.key}`}
            alt={image.originalFileName}
            style={{
              width: "100%",
            }}
          />
        ))}
    </div>
  );
};

export default ImageList;
