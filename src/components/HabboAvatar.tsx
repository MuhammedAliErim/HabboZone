import Image from 'next/image';

interface HabboAvatarProps {
  username?: string | null;
  direction?: 2 | 3 | 4 | 5;
  headDirection?: 2 | 3 | 4 | 5;
  gesture?: 'sml' | 'sad' | 'spk' | 'eyb' | 'agr' | 'sur' | 'std';
  action?: 'sit' | 'wlk' | 'lay' | 'std';
  size?: 'm' | 'l';
  headOnly?: boolean;
  className?: string;
}

export default function HabboAvatar({
  username,
  direction = 2,
  headDirection = 2,
  gesture = 'std',
  action = 'std',
  size = 'l',
  headOnly = false,
  className = '',
}: HabboAvatarProps) {
  
  if (!username) {
    return (
      <div className={`bg-black/20 rounded-full flex items-center justify-center border border-white/10 ${className}`}>
        <span className="text-white/20 font-bold text-xs">Yok</span>
      </div>
    );
  }

  const avatarUrl = `https://www.habbo.com.tr/habbo-imaging/avatarimage?user=${username}&direction=${direction}&head_direction=${headDirection}&gesture=${gesture}&action=${action}&size=${size}${headOnly ? '&headonly=1' : ''}`;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl}
        alt={`${username} Avatar`}
        className="object-contain drop-shadow-xl"
        loading="lazy"
      />
    </div>
  );
}
