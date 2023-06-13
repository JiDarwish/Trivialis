import { Card } from 'antd';
import { LinkedinOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Meta } = Card;

interface PersonProps {
  photo: string;
  name: string;
  title: string;
  linkedin: string;
}

const PersonCard: React.FC<PersonProps> = ({ photo, name, title, linkedin }) => {
  return (
    <Card
      style={{ width: 240 }}
      cover={
        <Image 
          alt="Employee Photo" 
          src={photo} 
          height={200}
          width={200}
          style={{ 
            objectFit: 'cover' 
          }} 
        />
      }
      actions={[
        <a href={linkedin} key="linkedin" target="_blank" rel="noopener noreferrer"><LinkedinOutlined key="linkedin" /></a>
      ]}
    >
      <Meta title={name} description={title} />
    </Card>
  );
};

export default PersonCard;
