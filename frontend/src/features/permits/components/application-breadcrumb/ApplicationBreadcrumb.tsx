import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Breadcrumb } from "../../../../common/components/breadcrumb/Breadcrumb";
import { Nullable } from "../../../../common/types/common";
import { PERMIT_ACTION_ORIGINS } from "../../types/PermitActionOrigin";
import { PERMIT_TABS } from "../../types/PermitTabs";
import {
  APPLICATION_QUEUE_ROUTES,
  APPLICATION_STEP_CONTEXTS,
  APPLICATIONS_ROUTES,
  ApplicationStep,
  ApplicationStepContext,
  IDIR_ROUTES,
} from "../../../../routes/constants";

export const ApplicationBreadcrumb = ({
  companyId,
  permitId,
  applicationNumber,
  applicationStep,
  applicationStepContext,
  isCopiedApplication,
  copyPermitOrigin,
}: {
  companyId: number;
  permitId?: Nullable<string>;
  applicationNumber?: Nullable<string>;
  applicationStep: ApplicationStep;
  applicationStepContext: ApplicationStepContext;
  isCopiedApplication: boolean;
  copyPermitOrigin?: Nullable<string>;
}) => {
  const navigate = useNavigate();

  const isQueueContext =
    applicationStepContext === APPLICATION_STEP_CONTEXTS.QUEUE;

  const isInitCopyContext =
    applicationStepContext === APPLICATION_STEP_CONTEXTS.COPY;
  
  const homePageLabel = useMemo(() => {
    if (isQueueContext) return "Home";
    if (copyPermitOrigin === PERMIT_ACTION_ORIGINS.ACTIVE_PERMITS)
      return "Active Permits";

    if (copyPermitOrigin === PERMIT_ACTION_ORIGINS.EXPIRED_PERMITS)
      return "Expired Permits";

    return "Permits";
  }, [isQueueContext, copyPermitOrigin]);

  const formPageLabel = useMemo(() => {
    if (isQueueContext && applicationNumber)
      return `Application #: ${applicationNumber}`;

    if (isInitCopyContext) return "Make Copy";
    if (isCopiedApplication) return "Copy";
    return "Permit Application";
  }, [
    isQueueContext,
    isInitCopyContext,
    applicationNumber,
    isCopiedApplication,
  ]);

  const goHome = useCallback(() => {
    if (isQueueContext)
      return navigate(IDIR_ROUTES.STAFF_HOME, { replace: true });

    if (copyPermitOrigin === PERMIT_ACTION_ORIGINS.ACTIVE_PERMITS)
      return navigate(APPLICATIONS_ROUTES.BASE, {
        state: {
          selectedTab: PERMIT_TABS.ACTIVE_PERMITS,
        },
      });

    if (copyPermitOrigin === PERMIT_ACTION_ORIGINS.EXPIRED_PERMITS)
      return navigate(APPLICATIONS_ROUTES.BASE, {
        state: {
          selectedTab: PERMIT_TABS.EXPIRED_PERMITS,
        },
      });

    return navigate(APPLICATIONS_ROUTES.BASE, { replace: true });
  }, [
    navigate,
    isQueueContext,
    copyPermitOrigin,
  ]);

  const goToFormPage = useCallback(() => {
    if (!permitId) return;

    if (isQueueContext && applicationNumber)
      return navigate(
        APPLICATION_QUEUE_ROUTES.EDIT(companyId, permitId),
        { replace: true },
      );

    if (isInitCopyContext || isCopiedApplication)
      return navigate(
        APPLICATIONS_ROUTES.DETAILS(permitId, true, copyPermitOrigin),
        { replace: true },
      );
    
    return navigate(
      APPLICATIONS_ROUTES.DETAILS(permitId),
      { replace: true },
    );
  }, [
    companyId,
    permitId,
    isQueueContext,
    isInitCopyContext,
    applicationNumber,
    isCopiedApplication,
    copyPermitOrigin,
  ]);

  const allLinks = [
    {
      text: homePageLabel,
      onClick: goHome,
    },
    {
      text: formPageLabel,
      onClick: goToFormPage,
    },
    {
      text: "Review and Confirm Details",
    },
  ];

  const getLinks = () => {
    const filteredLinks = allLinks.filter(
      (_, index) => index <= applicationStep,
    );

    return filteredLinks.map((link, index) => {
      if (index === applicationStep) {
        return {
          text: link.text,
        };
      }
      return link;
    });
  };

  return <Breadcrumb links={getLinks()} />;
};
