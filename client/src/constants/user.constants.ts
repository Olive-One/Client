import { UserStatus } from '@/types/user.types';

type StatusUI = {
  label: string;
  bgColor: string;
  className: string;
};

export const UserStatusMap: Record<UserStatus, StatusUI> = {
  [UserStatus.ACTIVE]: {
    label: 'Active',
    bgColor: 'bg-green-100',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  [UserStatus.INACTIVE]: {
    label: 'Inactive',
    bgColor: 'bg-red-100',
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
  [UserStatus.TEMPORARY]: {
    label: 'Temporary',
    bgColor: 'bg-orange-100',
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  },
};
  