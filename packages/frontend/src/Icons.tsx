import { FC, memo } from 'react';

interface IProps {
  className?: string;
}

export const DefaultAvatar: FC<IProps> = memo(({ className = '' }) => (
  <svg
    className={className}
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="user"
    role="img"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
    />
  </svg>
));

export const PasswordIcon: FC<IProps> = memo(({ className = '' }) => (
  <svg
    className={className}
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="lock"
    role="img"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
    />
  </svg>
));

export const EmailIcon: FC<IProps> = memo(({ className = '' }) => (
  <svg
    className={className}
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="envelope"
    role="img"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"
    />
  </svg>
));

export const ArrowDown: FC<IProps> = memo(({ className = '' }) => (
  <svg className={className} version="1.1" viewBox="0 0 129 129">
    <g>
      <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z"/>
    </g>
  </svg>
));

export const CrossBolderIcon: FC<IProps> = memo(({ className }) => (
  <svg className={className} width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M9.66659 1.27301L8.72659 0.333008L4.99992 4.05967L1.27325 0.333008L0.333252 1.27301L4.05992 4.99967L0.333252 8.72634L1.27325 9.66634L4.99992 5.93967L8.72659 9.66634L9.66659 8.72634L5.93992 4.99967L9.66659 1.27301Z' fill='#AAAAAA' />
  </svg>
));