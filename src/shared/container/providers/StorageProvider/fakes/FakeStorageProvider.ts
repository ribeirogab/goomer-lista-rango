import { IStorageProvider } from '../models/IStorageProvider';

export class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(
      storageFile => storageFile === file,
    );

    this.storage.splice(findIndex, 1);
  }

  public async onErrorDeleteUploadedFile(_file: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('Delete uploaded file');
  }
}
