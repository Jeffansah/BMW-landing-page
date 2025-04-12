import VideoPlayer from "../components/shared/hls-video-player";

const Hero = () => {
  return (
    <div className="relative h-[75dvh] w-full overflow-hidden">
      <div className="absolute inset-0 z-0 h-full w-full">
        <VideoPlayer src="https://bmw.scene7.com/is/content/BMW/i20_bev_home-teaser_dsk_sl-AVS.m3u8" />
      </div>
      <div className="safari-overlay absolute inset-0 z-10 min-h-full from-black to-transparent xl:w-[40%] xl:bg-gradient-to-r" />
    </div>
  );
};

export default Hero;
