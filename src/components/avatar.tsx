import Image from "next/image";
import { FC } from "react";
import clsx from "clsx";

interface AvatarProps {
  imageUrl?: string | null;
  username: string;
}

const Avatar: FC<AvatarProps> = ({ imageUrl, username }) => {
  const defaultAvatarUrl = `https://avatar.vercel.sh/${username}.svg?text=${
    username?.toUpperCase() || "U"
  }`;

  return (
    <div className={clsx("relative size-10 rounded-full overflow-hidden")}>
      <Image
        src={imageUrl || defaultAvatarUrl}
        alt={username ? `${username}'s avatar` : "User avatar"}
        className="object-cover"
        width={40}
        height={40}
        priority
      />
    </div>
  );
};

export default Avatar;
