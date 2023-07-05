export interface IFile {
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  buffer?: Buffer | ArrayBuffer;
  size?: number;
  filename?: string;
}
