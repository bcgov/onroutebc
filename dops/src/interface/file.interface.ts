export interface IFile {
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  buffer?: Buffer;
  size?: number;
  filename?: string;
  dmsId?: string;
}
