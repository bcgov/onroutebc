import React, { useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { Suspend } from "../../pages/Suspend";
import { SETTINGS_TABS, SettingsTab } from "../../types/tabs";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { ERROR_ROUTES } from "../../../../routes/constants";
import { SpecialAuthorizations } from "../../pages/SpecialAuthorizations/SpecialAuthorizations";
import { CreditAccountMetadataComponent } from "../../pages/CreditAccountMetadataComponent";
import { usePermissionMatrix } from "../../../../common/authentication/PermissionMatrix";
import { useGetCreditAccountMetadataQuery } from "../../hooks/creditAccount";
import { IDIR_USER_ROLE } from "../../../../common/authentication/types";
import { CREDIT_ACCOUNT_USER_TYPE } from "../../types/creditAccount";

export const ManageSettingsDashboard = React.memo(() => {
  const { companyId, idirUserDetails } = useContext(OnRouteBCContext);
  const { data: creditAccountMetadata, isPending } =
    useGetCreditAccountMetadataQuery(companyId as number);

  const isCreditAccountHolder =
    creditAccountMetadata?.userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER;

  /**
   * @returns The permission matrix function key.
   */
  const getPermissionMatrixFunctionKey = () => {
    if (!isPending && !creditAccountMetadata)
      return "ADD_CREDIT_ACCOUNT_NON_HOLDER_OR_USER";
    if (isCreditAccountHolder) {
      return "VIEW_CREDIT_ACCOUNT_TAB_ACCOUNT_HOLDER";
    } else {
      return "VIEW_CREDIT_ACCOUNT_TAB_ACCOUNT_USER";
    }
  };

  const isFinanceUser = idirUserDetails?.userRole === IDIR_USER_ROLE.FINANCE;

  const [hideSuspendTab, setHideSuspendTab] = useState<boolean>(false);

  const canViewSuspend = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_SETTINGS",
      permissionMatrixFunctionKey: "VIEW_SUSPEND_COMPANY_INFO",
    },
  });

  const showSuspendTab = canViewSuspend && !hideSuspendTab;

  const showSpecialAuth = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_SETTINGS",
      permissionMatrixFunctionKey: "VIEW_SPECIAL_AUTHORIZATIONS",
    },
  });

  const showCreditAccountTab = usePermissionMatrix({
    featureFlag: "CREDIT-ACCOUNT",
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_SETTINGS",
      permissionMatrixFunctionKey: getPermissionMatrixFunctionKey(),
    },
    additionalConditionToCheck: () =>
      // Show the tab if there is a credit account or if the user is a finance user.
      // Todo: ORV2-2771 Display info box if there is no credit account.
      Boolean(creditAccountMetadata) || isFinanceUser,
  });

  const { state: stateFromNavigation } = useLocation();

  const handleHideSuspendTab = (hide: boolean) => {
    setHideSuspendTab(hide);
  };

  if (!companyId) {
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  const tabs = [
    showSpecialAuth
      ? {
          label: "Special Authorizations",
          component: <SpecialAuthorizations companyId={companyId} />,
          componentKey: SETTINGS_TABS.SPECIAL_AUTH,
        }
      : null,
    showCreditAccountTab
      ? {
          label: "Credit Account",
          component: <CreditAccountMetadataComponent companyId={companyId} />,
          componentKey: SETTINGS_TABS.CREDIT_ACCOUNT,
        }
      : null,
    showSuspendTab
      ? {
          label: "Suspend",
          component: (
            <Suspend companyId={companyId} hideTab={handleHideSuspendTab} />
          ),
          componentKey: SETTINGS_TABS.SUSPEND,
        }
      : null,
  ].filter((tab) => Boolean(tab)) as {
    label: string;
    component: JSX.Element;
    componentKey: SettingsTab;
  }[];

  const getSelectedTabFromNavigation = (): number => {
    const tabIndex = tabs.findIndex(
      ({ componentKey }) => componentKey === stateFromNavigation?.selectedTab,
    );
    if (tabIndex < 0) return 0;
    return tabIndex;
  };

  const selectedTab = getSelectedTabFromNavigation();

  return (
    <TabLayout
      bannerText="Settings"
      componentList={tabs}
      selectedTabIndex={selectedTab}
    />
  );
});

ManageSettingsDashboard.displayName = "ManageSettingsDashboard";
