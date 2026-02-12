import React, { useRef, ChangeEvent } from "react";
import Upload from "../../assets/upload.svg";
import Tooltip from "../Tooltip";
import { useUIStore } from "../../hooks/useUIStore";
import { useImageStore } from "../../hooks/useImageStore";

const UploadButton = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { setImageUrl, setImageUrl: load } = useImageStore(); // Note: simplifying load for now
  const { closeToolbar } = useUIStore();

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = String(reader.result);
      setImageUrl(imageUrl);
      closeToolbar();
    };
    reader.readAsDataURL(file);
  };

  const clickHandler = () => {
    if (inputFileRef && inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <>
      <Tooltip content="Upload an image" placement="bottom">
        <img src={Upload} alt="upload" onClick={clickHandler} />
      </Tooltip>
      <input ref={inputFileRef} type="file" className="header__upload-image-input" onChange={uploadImage} accept="image/jpeg" />
    </>
  );
};

export default UploadButton;
