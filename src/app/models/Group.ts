import {User} from './User';

export interface Group {
  groupId: number;
  creatorId: number;
  creatorName: string;
  name: string;
  countOfUsers: number;
  users: User[];
  invited?: boolean;
}
