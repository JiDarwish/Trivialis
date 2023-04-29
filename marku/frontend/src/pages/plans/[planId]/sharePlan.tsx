import { Button } from "antd";
import { type NextPage } from "next";
import { ShareAltOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { Modal } from 'antd';
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookMessengerIcon,
} from 'react-share';

import Template, { ExpandingDiv } from "../../../components/layout/Template";
import ProtectedRoute from "../../../components/layout/ProtectedRoute";
import { inviteUser } from "../../../util/api/apiCalls";
import { useEffect, useState } from "react";
import CopyDisplay from "../../../components/generic/CopyDisplay";
import StaticBackground from "../../../components/generic/StaticBackground";


const SharingPlan: NextPage = () => {
  const router = useRouter();
  const { planId } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [shareLink, setShareLink] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleGeneratePackages = () => {
    router.push(`/plans/${planId}/generate-packages`);
  };

  const handleShare = async () => {
    const codeResponse = await inviteUser(planId as string);
    if (!codeResponse || codeResponse.error || !codeResponse.data) {
      toast.error("Error inviting user");
    }

    setCode(codeResponse.data?.code as string); // TEMP
    showModal();
  };

  useEffect(() => {
    if (!window || window == undefined) return;
    setShareLink(`${window.location.origin}/plans/accept-invite/${code}`)
  }, [code])

  return (
    <ProtectedRoute>
      <StaticBackground />
      <Template pageTitle="Sharing Trip">

        <div className="text-center font-dm-serif-display pt-14 md:pt-24 lg:pt-32 text-xl md:text-3xl lg:text-4xl">
          now let's see what your travel partner thinks...
        </div>

        <ExpandingDiv />

        <div className="flex justify-end pt-4">
          <Button type="primary" icon={<ShareAltOutlined />} onClick={handleShare}>
            Share with my partner
          </Button>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="primary" onClick={handleGeneratePackages}>
            Generate packages
          </Button>
        </div>


        <Modal
          cancelButtonProps={{ style: { display: 'none' } }}
          okButtonProps={{ style: { display: 'none' } }}
          title="Share this link with your travel partner"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <CopyDisplay code={shareLink} />
          <div className="pt-2">
            <WhatsappShareButton url={shareLink}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <FacebookShareButton url={shareLink}>
              <FacebookMessengerIcon size={32} round />
            </FacebookShareButton>
          </div>
        </Modal>

        <ExpandingDiv />
      </Template>
    </ProtectedRoute>
  );
};

export default SharingPlan;
