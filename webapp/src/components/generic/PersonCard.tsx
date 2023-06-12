import { Card } from 'antd';
import { LinkedinOutlined } from '@ant-design/icons';

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
      hoverable
      style={{ width: 240 }}
      cover={
        <img 
          alt="Employee Photo" 
          src={photo} 
          style={{ 
            width: '100%', 
            height: '200px', 
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
