import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { MediaApiService } from '../../services/media-api.service';
import { ToastNotification } from './toast-notification';

@Component({
  selector: 'app-media-finder',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, HttpClientModule, MatCardModule, MatTableModule, MatTabsModule, ToastNotification, MatIconModule],
  templateUrl: './media-finder.html',
  styleUrl: './media-finder.scss'
})
export class MediaFinder {
  mediaFiles: string[] = [];
  operation: 'save' | 'move' | null = null;
  showDeletePrompt = false;
  deleted = false;
  errorMessage = '';
  successMessage = '';
  sourceDir: string = '';
  destDir: string = '';
  displayedColumns = ['serial', 'directory', 'fileName'];
  successFiles: string[] = [];
  successOp: 'save' | 'move' | null = null;
  toastMessage = '';

  constructor(private mediaApi: MediaApiService) {}

  async scanSourceDirectory() {
    if (this.sourceDir) {
      try {
        const files: string[] = await this.mediaApi.scanDirectory(this.sourceDir);
        this.mediaFiles = files; // Use absolute paths directly
        this.operation = null;
        this.showDeletePrompt = false;
        this.deleted = false;
      } catch (err: any) {
        this.mediaFiles = [];
        this.errorMessage = err?.error || 'Failed to scan directory.';
      }
    }
  }

  async completeOperation(op?: 'save' | 'move') {
    const operation = op || this.operation;
    if (!operation) return;
    if (this.destDir) {
      this.mediaFiles.forEach(file => console.log("Initial Print file",file));
      const files = this.mediaFiles;
      // const files = this.mediaFiles.map(f => this.joinPath(this.sourceDir, f));

      files.forEach(file => console.log("Print file",file));
      try {
        let res: any[];
        if (operation === 'move') {
          res = await this.mediaApi.moveFiles(files, this.destDir);
        } else {
          res = await this.mediaApi.copyFiles(files, this.destDir);
        }
        if (Array.isArray(res) && res.length > 0) {
          const successfulFiles = res.filter((r: any) => r.success).map((r: any) => this.toRelativePath(r.message, this.destDir));
          const failedFiles = res.filter((r: any) => !r.success).map((r: any) => r.error);

          this.successFiles = successfulFiles;
          if (failedFiles.length > 0) {
            this.toastMessage = `Failed to process some files: ${failedFiles.join(', ')}`;
          } else {
            this.toastMessage = `✅ Operation completed successfully for ${successfulFiles.length} files.`;
          }
        } else {
          this.toastMessage = 'No files were processed.';
        }
        this.showDeletePrompt = operation === 'move';
        this.deleted = false;
        this.operation = null;
      } catch (err: any) {
        this.successFiles = [];
        this.successOp = null;
        this.successMessage = '';
        this.errorMessage = (err?.error && typeof err.error === 'string') ? err.error : `Failed to ${operation === 'save' ? 'save' : 'move'} files.`;
        this.toastMessage = this.errorMessage;
      }
    } else {
      this.successFiles = [];
      this.successOp = null;
      this.successMessage = '';
      this.errorMessage = 'Please enter a destination directory.';
      this.toastMessage = this.errorMessage;
    }
  }

  async deleteSourceFiles(confirm: boolean) {
    if (confirm) {
      try {
        await this.mediaApi.deleteFiles(this.mediaFiles);
        this.deleted = true;
        this.mediaFiles = [];
      } catch (_: any) {
        this.deleted = false;
      }
    } else {
      this.deleted = false;
    }
    this.showDeletePrompt = false;
  }

  // Utility: get relative path
  toRelativePath(abs: string, base: string): string {
    if (!abs.startsWith(base)) return abs;
    let rel = abs.slice(base.length);
    if (rel.startsWith('/') || rel.startsWith('\\')) rel = rel.slice(1);
    return rel;
  }

  // Utility: join base and relative
  joinPath(base: string, rel: string): string {
    if (!base.endsWith('/') && !base.endsWith('\\')) base += '/';
    return base + rel;
  }

  getDirectory(file: string): string {
    const lastSlash = file.lastIndexOf('/');
    if (lastSlash === -1) return '';
    return file.substring(0, lastSlash);
  }

  getFileName(file: string): string {
    const lastSlash = file.lastIndexOf('/');
    return lastSlash === -1 ? file : file.substring(lastSlash + 1);
  }

  async pasteFromClipboard(field: 'source' | 'dest') {
    try {
      const text = await navigator.clipboard.readText();
      if (field === 'source') {
        this.sourceDir = text;
      } else {
        this.destDir = text;
      }
    } catch (err: any) {
      this.toastMessage = 'Failed to read clipboard';
      setTimeout(() => this.toastMessage = '', 2000);
    }
  }
}
