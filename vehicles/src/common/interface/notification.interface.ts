import { NotificationTemplate } from '../enum/notification-template.enum';
import { CompanyDataNotification } from './company-data.notification.interface';
import { IssuePermitDataNotification } from './issue-permit-data.notification.interface';
import { ProfileRegistrationDataNotification } from './profile-registration-data.notification.interface';

export interface INotification {
  subject: string;
  to: string[];
  cc?: string[];
  templateName: NotificationTemplate;
  data:
    | CompanyDataNotification
    | ProfileRegistrationDataNotification
    | IssuePermitDataNotification;
}
