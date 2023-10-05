import { USER_AUTH_GROUP } from "../../../../../../manageProfile/types/userManagement.d";

export const getDefaultUserDetails = () => ({
  companyId: 74,
  userDetails: {
    firstName: "My",
    lastName: "Lastname",
    userName: "MYLASTNAME",
    phone1: "604-123-4567",
    phone1Extension: "123",
    phone2: "604-123-4568",
    phone2Extension: "234",
    email: "my.company@mycompany.co",
    fax: "604-123-4569",
    userAuthGroup: USER_AUTH_GROUP.ORGADMIN,
  },
});

export const getEmptyUserDetails = () => ({
  companyId: 74,
  userDetails: {
    firstName: "",
    lastName: "",
    userName: "",
    phone1: "",
    phone1Extension: "",
    phone2: "",
    phone2Extension: "",
    email: "",
    fax: "",
    userAuthGroup: "",
  },
});
