import { memo, useState } from "react";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import "./MyInfo.scss";
import { UserInfoBanner } from "../../../common/components/banners/UserInfoBanner";
import { DisplayMyInfo } from "./DisplayMyInfo";
import { getMyInfo } from "../apiManager/manageProfileAPI";
import { Loading } from "../../../common/pages/Loading";
import { Unauthorized } from "../../../common/pages/Unauthorized";
import { ErrorFallback } from "../../../common/pages/ErrorFallback";
import { MyInfoForm } from "../components/forms/myInfo/MyInfoForm";

const Header = () => (
  <Typography className="my-info-page__header" variant="h4">
    Edit My Information
  </Typography>
);

export const MyInfo = memo(() => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: myInfo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    keepPreviousData: true,
    staleTime: 5000,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return <Unauthorized />;
      }
      return <ErrorFallback error={error.message} />;
    }
  }

  return (
    <div className="my-info-page">
      {isEditing ? <Header /> : null}
      <UserInfoBanner userInfo={myInfo} />
      {isEditing ? (
        <MyInfoForm myInfo={myInfo} setIsEditing={setIsEditing} />
      ) : (
        <DisplayMyInfo myInfo={myInfo} setIsEditing={setIsEditing} />
      )}
    </div>
  );
});

MyInfo.displayName = "MyInfo";
