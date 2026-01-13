import { IDataProfile } from '@/api/interfaces/profile.interface';
import { PropsWithChildren } from 'react';

export interface IProfile {
  profile: IDataProfile | null;
}

export interface IResponseError {
  response: {
    data: {
      message: string;
      statusCode: string;
    };
  };
}

export interface UseProfile {
  user: IDataProfile | null;
  loading: boolean;
  error?: IResponseError | undefined;
  refetch: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthProviderProps extends PropsWithChildren {}
