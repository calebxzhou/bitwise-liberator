import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getImageDimensions } from '../util';
import {
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'bl-image-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatInputModule,
    CdkDropList,
    CdkDrag,
    MatButtonModule,
  ],
  templateUrl: './image-selector.component.html',
  styles: ``,
})
export class ImageSelectorComponent {
  deleteImage(index: number) {
    this.images.splice(index, 1);
  }
  images: ImageItem[] = [];
  @Input() multipleImages!: boolean;
  @Output() imagesLoaded = new EventEmitter<ImageItem[]>();

  handleImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    let files = input.files;
    if (!files || files.length === 0) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      this.readFile(files[i]);
    }
  }

  private readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result as string;
      getImageDimensions(base64).then((size) => {
        let img = new ImageItem(file.name, base64, size.width, size.height);
        if (this.multipleImages) this.images.push(img);
        else this.images[0] = img;
        this.imagesLoaded.emit(this.images);
      });
      // Resolve the promise with the ImageUpload instance
    };
    reader.readAsDataURL(file);
  }
  drop(event: CdkDragDrop<ImageItem[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
    this.imagesLoaded.emit(this.images);
  }
}

export class ImageItem {
  name: string;
  data: string;
  width: number;
  height: number;
  constructor(name: string, data: string, width: number, height: number) {
    this.name = name;
    this.data = data;
    this.width = width;
    this.height = height;
  }
}
export function getImageDisplayName(img: ImageItem) {
  return img.name.split('.')[0];
}
