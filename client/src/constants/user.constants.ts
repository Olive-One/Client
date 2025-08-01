export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    TEMPORARY = 'TEMPORARY',
  }
  
  type StatusUI = {
    label: string;
    color: string;
    bgColor: string;
  };
  
  export const UserStatusMap: Record<UserStatus, StatusUI> = {
    [UserStatus.ACTIVE]: {
      label: 'Active',
      color: 'green.700',
      bgColor: 'green.transparent',
    },
    [UserStatus.INACTIVE]: {
      label: 'Inactive',
      color: 'red.650',
      bgColor: 'red.transparent',
    },
    [UserStatus.TEMPORARY]: {
      label: 'Temporary',
      color: 'orange',
      bgColor: 'orange.transparent',
    },
  };
  