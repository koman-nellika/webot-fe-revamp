import React, { useEffect, useRef, useState } from "react";
import Images from "@/components/Images";
import { Slider } from "antd";
import { useMutation } from "react-query";
import { CampaignController } from "@/api/controllers/campaign";

const basePath = process.env.NEXT_PUBLIC_PREFIX;

const AudioPlayer = (props: any) => {
  const audioPlayer = useRef<HTMLMediaElement>(null);
  const [play, setPlay] = useState<any>(false);
  const [file, setFile] = useState<any>("");
  const [mute, setMute] = useState<any>(false);
  const [showVolume, setShowVolume] = useState<any>(false);
  const [volume, setVolume] = useState<any>(0);
  const [time, setTime] = useState<any>(0);
  const [maxTime, setMaxTime] = useState<any>(0);

  useEffect(() => {
    clearOnChange();
    if (props.filePath) {
      playVoice(props.filePath);
    }
  }, [props.filePath, props.filePathUpload]);

  const { mutate: playVoice } = useMutation(CampaignController().playVoice, {
    onSuccess: async (res: any) => {
      const audioBlob = new Blob([res]);

      const audioURL = URL.createObjectURL(audioBlob);
      setFile(audioURL);
    },
    onError: async (err: any) => {
      console.log("err", err);
    },
  });
  const src = props.filePathUpload ? `${props.filePathUpload}` : file;

  const clearIcon = (ele: any) => {
    const findIconPlaying = document.querySelectorAll('img[class*="playing"]');
    if (findIconPlaying && findIconPlaying?.length > 0) {
      findIconPlaying.forEach((e) => {
        if (ele !== e.getAttribute("data-id")) {
          e.setAttribute("class", "cursor-pointer");
          e.setAttribute("alt", "audio-pause");
          if (e.getAttribute("data-type") === "circle") {
            e.setAttribute("src", `${basePath}/images/play-inline.svg`);
            e.setAttribute("srcset", `${basePath}/images/play-inline.svg`);
          } else {
            e.setAttribute("src", `${basePath}/images/audio-play.svg`);
            e.setAttribute("srcset", `${basePath}/images/audio-play.svg`);
          }
        }
      });
    }
  };

  const clearAudio = (ele: any) => {
    const findAllAudioPlay = document.querySelectorAll("audio");
    if (findAllAudioPlay && findAllAudioPlay?.length > 0) {
      findAllAudioPlay.forEach((el) => {
        if (ele !== el.getAttribute("data-id")) {
          el.pause();
        }
      });
    }
  };

  const onPlayAudio = async (el: any) => {
    const eleDataId = el.target.getAttribute("data-id");
    const eleClass = el.target.getAttribute("class");
    const eleAlt = el.target.getAttribute("alt");
    clearIcon(eleDataId);
    clearAudio(eleDataId);
    if (maxTime !== 0) {
      // Play
      if (
        eleClass.trim() === "cursor-pointer" &&
        eleAlt.trim() === "audio-pause"
      ) {
        el.target.setAttribute("class", "cursor-pointer playing");
        el.target.setAttribute("alt", "audio-play");
        el.target.setAttribute("src", `${basePath}/images/audio-pause.svg`);
        el.target.setAttribute("srcset", `${basePath}/images/audio-pause.svg`);
        audioPlayer && audioPlayer.current?.play();
      }

      // Pause
      if (
        eleClass.trim() === "cursor-pointer playing" &&
        eleAlt.trim() === "audio-play"
      ) {
        el.target.setAttribute("class", "cursor-pointer");
        el.target.setAttribute("alt", "audio-pause");
        el.target.setAttribute("src", `${basePath}/images/audio-play.svg`);
        el.target.setAttribute("srcset", `${basePath}/images/audio-play.svg`);
        audioPlayer && audioPlayer.current?.pause();
      }
      setPlay(!play);
    }
  };

  const clearOnChange = async (el?: any) => {
    const findIconPlaying = document.querySelectorAll('img[class*="playing"]');

    if (findIconPlaying && findIconPlaying?.length > 0) {
      findIconPlaying.forEach((e) => {
        e.setAttribute("class", "cursor-pointer");
        e.setAttribute("alt", "audio-pause");
        e.setAttribute("src", `${basePath}/images/audio-play.svg`);
        e.setAttribute("srcset", `${basePath}/images/audio-play.svg`);
      });
    }
  };

  const clearEnded = async (el: any) => {
    const eleDataId = el.target.getAttribute("data-id");
    const findIconPlaying = document.querySelectorAll('img[class*="playing"]');

    if (findIconPlaying && findIconPlaying?.length > 0) {
      findIconPlaying.forEach((e) => {
        if (eleDataId === e.getAttribute("data-id")) {
          e.setAttribute("class", "cursor-pointer");
          e.setAttribute("alt", "audio-pause");
          e.setAttribute("src", `${basePath}/images/audio-play.svg`);
          e.setAttribute("srcset", `${basePath}/images/audio-play.svg`);
        }
      });
    }
  };
  const onSwitchMute = () => {
    setMute(!mute);
    if (audioPlayer.current) {
      if (!mute) {
        audioPlayer.current.volume = 0;
      } else {
        audioPlayer.current.volume = volume;
      }
    }
  };
  const onChange = (time: any) => {
    if (audioPlayer.current) {
      setTime(time);
      audioPlayer.current.currentTime = time;
    }
  };

  const onChangeVolumn = (value: any) => {
    if (audioPlayer.current) {
      setVolume(value);
      audioPlayer.current.volume = value;
      if (value === 0) {
        setMute(true);
      } else {
        setMute(false);
      }
    }
  };

  const toHHMMSS = (secs: any) => {
    let sec_num = parseInt(secs, 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor(sec_num / 60) % 60;
    let seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  const onLoadedMetadata = (value: any) => {
    setPlay(false);
    setMaxTime(value.target.duration);
    setVolume(value.target.volume);
  };

  const onTimeUpdate = (value: any) => {
    setTime(value.target.currentTime);
  };

  return (
    <div
      className={`player ${props.classNamePlayer ? props.classNamePlayer : ""}`}
    >
      <audio
        ref={audioPlayer}
        src={src}
        className={`hidden`}
        data-id={`${props.filePath}`}
        controls
        onEnded={(e) => {
          setPlay(false);
          clearEnded(e);
        }}
        onLoadedMetadata={(e) => onLoadedMetadata(e)}
        onTimeUpdate={(e) => onTimeUpdate(e)}
      >
        <source src={src} type="audio/wav" />
      </audio>
      {props.default ? (
        <div
          className={`${
            props.className || ""
          } flex h-[45px] w-[300px] items-center justify-between rounded-full bg-[#F6F9FF] p-[10px]`}
        >
          <Images
            className={`cursor-pointer`}
            onClick={(e) => onPlayAudio(e)}
            src={"/images/audio-play.svg"}
            alt="audio-pause"
            width={25}
            height={25}
            data-id={
              !props.rowId && !props.columnType
                ? `${props.customerId}_${props.fileName}`
                : `${props.rowId}_${props.columnType}`
            }
          />
          <span className="flex w-[90px] items-center justify-center text-[20px]">
            {toHHMMSS(time)} / {toHHMMSS(maxTime)}
          </span>
          <Slider
            tooltipVisible={false}
            autoFocus
            max={maxTime}
            value={time}
            defaultValue={0}
            step={0.01}
            className={showVolume ? "w-[60px]" : "w-[120px]"}
            onChange={(e) => {
              onChange(e);
            }}
          />
          <div
            className={
              showVolume
                ? "flex w-auto flex-row rounded-full bg-[#fff] px-[5px]"
                : "flex w-auto flex-row"
            }
            onMouseLeave={() => setShowVolume(false)}
            onMouseOver={() => setShowVolume(true)}
            onFocus={() => setShowVolume(true)} // เพิ่ม onFocus
            onBlur={() => setShowVolume(false)} // เพิ่ม onBlur เพื่อจัดการการออกจากโฟกัส
            tabIndex={0} // ทำให้ div สามารถรับโฟกัสได้
          >
            {showVolume && (
              <Slider
                tooltip={{ open: false }}
                className="w-[50px]"
                max={1}
                min={0}
                value={volume}
                step={0.01}
                onChange={(e) => onChangeVolumn(e)}
              />
            )}
            <Images
              className="cursor-pointer"
              onClick={() => onSwitchMute()}
              src={!mute ? "/images/speeker.svg" : "/images/speeker-off.svg"}
              alt="audio-speeker"
              width={20}
              height={20}
            />
          </div>
        </div>
      ) : (
        <>
          <Images
            className={`cursor-pointer`}
            data-id={`${props.filePath}`}
            onClick={async (e) => {
              onPlayAudio(e);
            }}
            src={"/images/audio-play.svg"}
            alt={"audio-pause"}
            width={props.smallSize ? 25 : 40}
            height={props.smallSize ? 25 : 40}
          />
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
