import React from "react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

interface VideoListProps {
  videos: Video[];
  onSelect: (videoId: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onSelect }) => {
  return (
    <div>
      {videos.map((video) => (
        <div key={video.id} onClick={() => onSelect(video.id)}>
          <img src={video.thumbnail} alt={video.title} width="200" />
          <p>{video.title}</p>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
