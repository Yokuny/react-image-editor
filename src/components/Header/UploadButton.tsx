import { Upload } from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { useImageStore } from "../../hooks/useImageStore";
import { useUIStore } from "../../hooks/useUIStore";
import Tooltip from "../Tooltip";

const UploadButton = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { setImageUrl } = useImageStore();
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
        <Upload onClick={clickHandler} />
      </Tooltip>
      <input ref={inputFileRef} type="file" className="header__upload-image-input" onChange={uploadImage} accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" />
    </>
  );
};

export default UploadButton;
