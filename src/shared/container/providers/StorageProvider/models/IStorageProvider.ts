export interface IStorageProvider {
  saveFile(file: string): Promise<string>;

  deleteFile(file: string): Promise<void>;

  onErrorDeleteUploadedFile(file: string): Promise<void>;
}
