import { Gender, RelationshipStatus } from "@prisma/client";
import { RELATIONSHIP_STATUS_ENUM } from "./../lib/constants";
export type ApiError = {
  type: string;
  message: string;
};

export type ApiResponse<T> =
  | {
      success: true;
      message?: string;
      data: T;
    }
  | {
      success: false;
      message?: string;
      errors: ApiError[];
    };

export type UserData = {
  id: string;
  username: string;
  email: string;
};
export type DefaultValues = {
  profileImage?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  gender?: Gender;
  relationshipStatus?: RelationshipStatus;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

export enum TabsType {
  FOR_YOU = "for-you",
  FOLLOWING = "following",
}

export type TabProps = {
  activeTab: TabsType;
};
