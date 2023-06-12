import { type NextPage } from "next";
import { ClockCircleOutlined, SearchOutlined, MessageOutlined } from '@ant-design/icons';

import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";
import PersonCard from "marku/components/generic/PersonCard";
import BetaForm from "marku/components/generic/betaForm";
import Head from "next/head";


const MarkuFeatures = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-start">
        <SearchOutlined className="text-2xl text-purple-500 mr-2" />
        <p>Conduct in-depth market research tailored to your industry and target audience, quickly and effortlessly.</p>
      </div>

      <div className="flex items-start">
        <MessageOutlined className="text-2xl text-purple-500 mr-2" />
        <p>Optimize your messaging for maximum impact on the right social media platforms and prime posting channels.</p>
      </div>

      <div className="flex items-start">
        <ClockCircleOutlined className="text-2xl text-purple-500 mr-2" />
        <p>Automate your posting schedules, creating a bespoke marketing campaign that works around the clock.</p>
      </div>
    </div>
  );
}


const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>MarkU: Marketing automation</title> 
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="font-inter">
        <nav className="flex items-center justify-between flex-wrap bg-white py-6 px-24">
          <div className="flex items-center flex-shrink-0 text-black mr-6">
            <Link href='/'>
              <img alt="MarkU logo" src="/logo_white_u.png" className="w-48 max-h-full h-auto object-contain" />
            </Link>
          </div>
          <div>
            <a href='#about' style={{ scrollBehavior: "smooth" }}>
              <Button type="ghost" className="text-xl">About</Button>
            </a>
            <a href='#team'>
              <Button type="ghost" className="text-xl">The team</Button>
            </a>
            <a href='#tryIt'>
              <Button type="ghost" className="text-xl">Try it out</Button>
            </a>
          </div>
        </nav>
        <main>

          <section className="flex font-extralight justify-around items-center flex-wrap mt-32 py-12 mb-20">
            <div>
              <div className="text-4xl mb-3">Tired of marketing business on your own?</div>
              <div className="text-4xl"><span className="text-[#5917b2] font-normal">MarkU</span> will do it for you</div>
            </div>
            <div>
              <Image src="/socialMediaRoulette.png" alt="Social media roulette" width={350} height={350} />
            </div>
          </section>

          <section className="bg-[#5917b2] text-white py-24 pl-20 pr-32">
            <div className="w-7/12">
              <div className="text-3xl mb-3">Feeling drowned in time-consuming marketing tasks that fall outside of your core expertise?</div>
              <div className="text-lg mb-10">You're not alone! Countless small and medium-size businessess struggle with this every day</div>
              <div className="text-xl">MarkU was born out of the necessity to simplify and accelerate marketing activities, MarkU is designed to empower your business</div>
            </div>
          </section>

          <section id="about" className="flex justify-between items-center py-12 px-24">
            <div>
              <Image src="/social-media-marketing-in-mobile-online-3679266.png" alt="Marketing icon" width={500} height={500} />
            </div>
            <div className="w-6/12">
              <div className="text-4xl mb-7"><span className="text-[#5917b2]">MarkU</span> will:</div>
              <MarkuFeatures />
            </div>
          </section>


          <section id="team" className="bg-[#5917b2] text-white py-24 pl-20 pr-32 flex flex-col items-center">
            <div className="text-5xl mb-5">Meet the team</div>
            <div className="w-9/12">Welcome to the crew behind MarkU - a dynamic group of friends bound by a relentless quest for efficiency. We've harnessed this passion to craft MarkU, a cutting-edge tool designed for those who seek marketing success without the time-consuming hassle. With MarkU, we're not just streamlining marketing, we're redefining it - one efficient campaign at a time!</div>
            <div className="grid grid-cols-3 gap-10 mt-10">
              <PersonCard name="Frenk" photo="/team/frenk.jpg" title="Leadership" linkedin="https://www.linkedin.com/in/frenk-dragar/" />
              <PersonCard name="Tiago" photo="/team/tiago.jpg" title="Pipeline Engineer" linkedin="https://www.linkedin.com/in/tiagozdc/" />
              <PersonCard name="Ji" photo="/team/ji.png" title="Software/ML engineer" linkedin="https://www.linkedin.com/in/ji-darwish/" />
              <PersonCard name="Emily" photo="/team/emily.JPG" title="Creative business specialist" linkedin="https://www.linkedin.com/in/emily-kamperman-9450b1139/" />
              <PersonCard name="Vito" photo="/team/vito.jpg" title="Prompt Engineer" linkedin="https://www.linkedin.com/in/vitovekic/" />
              <PersonCard name="Kasia" photo="/team/kasia.png" title="UI/UX" linkedin="https://www.linkedin.com/in/kedzielska/" />
            </div>
          </section>


          <section id="tryIt" className="py-12 ">
            <div className="w-7/12 mx-auto">
              <div className="text-center text-2xl mb-5">Would you like to try it out?</div>
              <div className="text-lg mb-3">Sign up for our beta and we'll let you know when it's ready!</div>
              <BetaForm />
            </div>
          </section>

        </main>
        <footer className="flex justify-between my-10 mx-12">
          <div>MarkU, 2023</div>
          <div>Contact: <a className="no-underline" href="mailto:ji.darwish98@gmail.com">MarkU team</a></div>
        </footer>
      </div>
    </>
  );
};

export default Home;

