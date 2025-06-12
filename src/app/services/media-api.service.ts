import { Injectable } from '@angular/core';
// @ts-ignore
const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };

export interface MoveCopyRequest {
  files: string[];
  destination: string;
}

@Injectable({ providedIn: 'root' })
export class MediaApiService {
  sourceDir: string = '';

  scanDirectory(path: string): Promise<any[]> {
    return ipcRenderer.invoke('scan-directory', path);
  }

  async moveFiles(files: string[], destination: string): Promise<any> {
    try {
      const results = await Promise.all(files.map(async file => {
        const relPath = file.replace(this.sourceDir.replace(/\/$/, ''), '').replace(/^\/+/, '');
        const destPath = destination.replace(/\/$/, '');
        const response = await ipcRenderer.invoke('move-file', file, destPath);
        if (!response.success) {
          throw new Error(response.error || 'Failed to move file');
        }
        return response;
      }));
      return results;
    } catch (error) {
      console.error('Error moving files:', error);
      throw error;
    }
  }

  async copyFiles(files: string[], destination: string): Promise<any> {
    try {
      const results = await Promise.all(files.map(async file => {
        const relPath = file.replace(this.sourceDir.replace(/\/$/, ''), '').replace(/^\/+/, '');
        const destPath = destination.replace(/\/$/, '');
        const response = await ipcRenderer.invoke('copy-file', file, destPath);
        if (!response.success) {
          throw new Error(response.error || 'Failed to copy file');
        }
        return response;
      }));
      return results;
    } catch (error) {
      console.error('Error copying files:', error);
      throw error;
    }
  }

  deleteFiles(files: string[]): Promise<any> {
    // Delete each file
    return Promise.all(files.map(file => ipcRenderer.invoke('delete-file', file)));
  }
}
