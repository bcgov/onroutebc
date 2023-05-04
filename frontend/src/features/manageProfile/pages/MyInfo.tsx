import { memo, useState } from "react";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { UserInfoBanner } from "../../../common/components/banners/UserInfoBanner";
import { DisplayMyInfo } from "./DisplayMyInfo";
import { getMyInfo } from "../apiManager/manageProfileAPI";
import { Loading } from "../../../common/pages/Loading";
import { Unauthorized } from "../../../common/pages/Unauthorized";
import { ErrorFallback } from "../../../common/pages/ErrorFallback";

const Header = () => (
  <Typography
    variant="h4"
    sx={{
      color: BC_COLOURS.bc_black,
      marginTop: "20px",
    }}
  >
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
    <>
      {isEditing ? <Header /> : null}
      <UserInfoBanner userInfo={myInfo} />
      {isEditing ? (
        <>Edit My Information Form here</>
      ) : (
        <DisplayMyInfo myInfo={myInfo} setIsEditing={setIsEditing} />
      )}
    </>
  );
});

MyInfo.displayName = "MyInfo";
