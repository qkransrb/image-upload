import React, { useState, useContext } from "react";
import "./UploadForm.css";
import axios from "axios";
import { toast } from "react-toastify";
import Progress from "./Progress";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const [images, setImages] = useContext(ImageContext);

  const [file, setFile] = useState(undefined);
  const [filename, setFilename] = useState("이미지 파일을 업로드 해주세요.");
  const [percent, setPercent] = useState(0);
  const [imgSrc, setImgSrc] = useState(undefined);

  const onChangeHandler = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (ProgressEvent) => {
            setPercent(
              parseInt(100 * (ProgressEvent.loaded / ProgressEvent.total))
            );
          },
        }
      );

      setImages([...images, data]);

      toast.success("Upload Successfully.");
      setTimeout(() => {
        setPercent(0);
        setFile(undefined);
        setImgSrc(undefined);
        setFilename("이미지 파일을 업로드 해주세요.");
      }, [3000]);
    } catch (error) {
      console.error(`image upload - ${error}`);
      toast.error("Upload Failed.");
      setPercent(0);
      setFile(undefined);
      setImgSrc(undefined);
      setFilename("이미지 파일을 업로드 해주세요.");
      throw error;
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      {imgSrc && (
        <img
          src={imgSrc}
          alt="preview"
          className={`image-preview ${imgSrc && "image-preview-show"}`}
        />
      )}
      <Progress percent={percent} />
      <div className="file-dropper">
        <label htmlFor="image">{filename}</label>
        <input
          type="file"
          id="image"
          accept="image/jpeg,image/png"
          onChange={onChangeHandler}
        />
      </div>
      <button type="submit" className="btn">
        제출
      </button>
    </form>
  );
};

export default UploadForm;
