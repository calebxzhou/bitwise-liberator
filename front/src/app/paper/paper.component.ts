import { Component, OnInit } from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { CommonModule } from '@angular/common';
import { LiberDoc, SituPaper } from '../liberdoc';
declare var mammoth: any;

@Component({
  selector: 'bl-paper',
  standalone: true,
  imports: [CommonModule, TitleComponent],
  templateUrl: './paper.component.html',
  styles: ``,
})
export class PaperComponent implements OnInit {
  preview: string = '';
  ngOnInit(): void {
    new LiberDoc().situ(new SituPaper()).save();
  }
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const arrayBuffer = reader.result as ArrayBuffer;
        mammoth
          .convertToHtml({ arrayBuffer })
          .then((result: any) => {
            // The extracted text is in result.value
            this.preview = result.value;
            console.log(result.messages);
            // Split the text into paragraphs
            // Now you can perform operations on the paragraphs
          })
          .catch((err: any) => console.error(err));
      };

      reader.readAsArrayBuffer(file);
    }
  }
}
