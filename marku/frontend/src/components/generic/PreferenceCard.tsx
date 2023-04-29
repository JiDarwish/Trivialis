import { Card } from "antd";
import { useState, type FC } from "react";
import Image from 'next/image'


type ImageObject = {
  id: number;
  path: string;
  value: number;
}

// Create type for bla
type PreferenceCardProps = {
  key: string;
  text: string;
  image1: ImageObject;
  image2: ImageObject;
  handleSelect: (value: number) => void;
};

const PreferenceCard: FC<PreferenceCardProps> = ({ text, image1, image2, handleSelect }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const imgClickHandler = (imagePath: string) => {
    setSelectedImage(imagePath);
    handleSelect(imagePath === image1.path ? image1.value : image2.value);
  };

  return (
    <Card>
      <div className="text-center md:text-lg lg:text-xl">Which one do you prefer?</div>
      <div className="text-center text-sm">{text}</div>
      {/* create grid display with two images next to each other in a checkbx manner so a user can select one of them  */}
      <div className="flex flex-row justify-center pt-4">
        <div
          className={`relative cursor-pointer w-32 h-32 md:w-56 md:h-56 lg:w-72 lg:h-72 transition-all duration-200 ease-in-out 
          ${selectedImage === image1.path ? "border-2 border-blue-500 border-solid scale-105" : ""}`}
          onClick={() => imgClickHandler(image1.path)}>
          <Image src={image1.path} alt={image1.path} fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="w-3" />
        <div
          className={`relative cursor-pointer w-32 h-32 md:w-56 md:h-56 lg:w-72 lg:h-72 transition-all duration-200 ease-in-out 
          ${selectedImage === image2.path ? "border-2 border-blue-500 border-solid scale-105" : ""}`}
          onClick={() => imgClickHandler(image2.path)}>
          <Image src={image2.path} alt={image2.path} fill style={{ objectFit: 'cover' }} />
        </div>
      </div>
    </Card>
  );
};

export default PreferenceCard;
