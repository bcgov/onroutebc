import { useNavigate } from "react-router-dom";

import { Breadcrumb } from "../../../../common/components/breadcrumb/Breadcrumb";
import { Nullable } from "../../../../common/types/common";
import { 
  APPLICATIONS_ROUTES,
  ApplicationStep,
} from "../../../../routes/constants";

export const ApplicationBreadcrumb = ({
  permitId,
  applicationStep,
}: {
  permitId?: Nullable<string>;
  applicationStep: ApplicationStep;
}) => {
  const navigate = useNavigate();

  const allLinks = permitId ? [
    {
      text: "Permits",
      onClick: () => navigate(APPLICATIONS_ROUTES.BASE, { replace: true }),
    },
    {
      text: "Permit Application",
      onClick: () => navigate(APPLICATIONS_ROUTES.DETAILS(permitId), { replace: true }),
    },
    {
      text: "Review and Confirm Details",
      onClick: () => navigate(APPLICATIONS_ROUTES.REVIEW(permitId), { replace: true }),
    },
    {
      text: "Pay for Permit",
    },
  ] : [
    {
      text: "Permits",
      onClick: () => navigate(APPLICATIONS_ROUTES.BASE, { replace: true }),
    },
    {
      text: "Permit Application",
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

  return (
    <Breadcrumb links={getLinks()} />
  );
};
