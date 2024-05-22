import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'bl-paper-format',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './paper-format.component.html',
  styles: ``,
})
export class PaperFormatComponent {
  constructor(private http: HttpClient) {}

  upload(event: Event) {
    const inputEvent = event as InputEvent;
    const file = (inputEvent.target as HTMLInputElement).files![0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const payload = {
        file: base64String.split('base64,')[1],
        toc: true,
      };
      this.sendToServer(payload);
    };
    reader.readAsDataURL(file);
  }

  private sendToServer(payload: { file: string; toc: boolean }) {
    this.http
      .post('http://localhost:19001/paperOptimizer', payload, {
        responseType: 'blob',
      })
      .subscribe({
        next: (response) => this.saveToFileSystem(response),
        error: (error) => console.error('Error:', error),
      });
  }

  private saveToFileSystem(response: Blob) {
    const blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '1.docx';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
