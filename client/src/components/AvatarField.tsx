import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

interface AvatarFieldProps {
  src?: string;
  name: string;
  size: number;
  register: ReturnType<typeof useForm>['register'];
}

const AvatarField: React.FC<AvatarFieldProps> = ({
  src,
  name,
  size,
  register,
}) => {
  const inputRef = useRef<HTMLInputElement>();
  const avatarRef = useRef<HTMLImageElement>(null);

  return (
    <>
      <IconButton onClick={() => inputRef.current?.click()}>
        <Avatar style={{ width: size, height: size }}>
          <img
            ref={avatarRef}
            src={src ?? `https://www.gravatar.com/avatar?s=${size}`}
            style={{ width: size, height: size }}
            alt="avatar"
          />
        </Avatar>
      </IconButton>

      <input
        accept="image/png,image/jpeg"
        style={{ display: 'none' }}
        name={name}
        type="file"
        onChange={event => {
          const file = event.target.files?.[0];

          if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
              if (avatarRef.current && typeof reader.result === 'string') {
                avatarRef.current.src = reader.result;
              }
            };

            reader.readAsDataURL(file);
          }
        }}
        ref={el => {
          if (el) {
            inputRef.current = el;
          }

          register(el);
        }}
      />
    </>
  );
};

export default AvatarField;
