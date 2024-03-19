import { INotification } from './notification.interface';

export interface INotificationDocument extends INotification {
  documentIds?: string[];
}
