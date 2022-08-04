import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await axios.get("http://localhost:5000/images");
      setImages(data);
    };
    fetchImages();
  }, []);

  return (
    <ImageContext.Provider value={[images, setImages]}>
      {children}
    </ImageContext.Provider>
  );
};
