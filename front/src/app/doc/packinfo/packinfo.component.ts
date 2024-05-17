import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlobReader, Entry, TextWriter, ZipReader } from '@zip.js/zip.js';
import { LiberDoc } from '../../liberdoc/liberdoc';
import { TableCellInfo, Table3lColumn } from '../../liberdoc/doc-table';

@Component({
  selector: 'bl-packinfo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './packinfo.component.html',
  styles: ``,
})
export class PackinfoComponent implements OnInit {
  packages: Package[] = [];
  ngOnInit(): void {
    let json = localStorage.getItem('packinfo');
    if (json) {
      this.packages = JSON.parse(json);
    }
  }
  handleDir(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      alert('禁止选择空文件夹');
      return;
    }
    const files = input.files;
    const packageMap = new Map<string, FileItem[]>();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePathArray = file.webkitRelativePath.split('/');
      if (filePathArray.shift() !== 'src') {
        alert('未选择src文件夹，可能会出现问题');
      }
      const dirName = filePathArray
        .slice(0, -1)
        .join('/')
        .replaceAll('main/java/', '')
        .replaceAll('test/java/', '')
        .replaceAll('app/', '')
        .replaceAll('main/resources/', '')
        .replaceAll('main/webapp/', '')
        .replaceAll('main/WebContent/', '');
      if (dirName.length === 0) continue;

      //只要java py cs格式的文件
      if (!file.name.match(/\.(java|py|cs|ts)$/)) continue;

      let fileItem: FileItem = {
        id: file.name,
        name: '用于存储程序的代码',
      };
      if (fileItem.id.toLowerCase().includes('controller')) {
        fileItem.name = '对应实体的控制器类';
      } else if (fileItem.id.toLowerCase().includes('service')) {
        fileItem.name = '对应实体的业务逻辑类';
      } else if (fileItem.id.toLowerCase().includes('mapper')) {
        fileItem.name = '对应实体的数据映射类';
      }
      if (!packageMap.has(dirName)) {
        packageMap.set(dirName, []);
      }
      packageMap.get(dirName)?.push(fileItem);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        //读文本
        let text = e.target?.result as string;
        if (text) {
          //第一行
          let fileItemName = text.split(/\r\n|\n/)[0];
          const commentMatch = fileItemName.match(/^(\/\/|#)(.+)/);

          if (commentMatch) {
            // Extract the string after // or #
            fileItem.name = commentMatch[2].trim();
          }
        }
      };
      reader.readAsText(file);
    }
    this.packages = Array.from(packageMap, ([name, files]) => {
      let comment = '文件'; // Default  name
      if (name.includes('controller')) {
        comment = '控制器类';
      } else if (name.includes('service')) {
        comment = '服务类';
      } else if (name.includes('mapper')) {
        comment = '数据库映射类';
      } else if (name.includes('filter')) {
        comment = '过滤器';
      } else if (name.includes('dao')) {
        comment = '数据访问对象';
      } else if (name.includes('listener')) {
        comment = '监听器';
      } else if (name.includes('config')) {
        comment = '配置';
      } else if (name.includes('util')) {
        comment = '工具类';
      } else if (
        name.includes('entity') ||
        name.includes('model') ||
        name.includes('po')
      ) {
        comment = '实体类';
      }
      let packageName = `用于存储${comment}的包`; // Default  name
      return {
        id: name.replaceAll('/', '.'),
        name: packageName,
        files,
      };
    });

    localStorage.setItem('packinfo', JSON.stringify(this.packages));
  }
  removePackage(pIdx: number) {
    this.packages.splice(pIdx, 1);
  }
  exportWord() {
    let doc = new LiberDoc()
      .h1('3 系统实现')
      .h2('3.1 系统框架')
      .p('工程目录结构图，如图3.1所示')
      .h6('图3.1 工程目录结构图');
    for (let i = 0; i < this.packages.length; i++) {
      let pkg = this.packages[i];
      let cells: TableCellInfo[][] = [];
      pkg.files.forEach((file) => {
        cells.push([new TableCellInfo(file.id), new TableCellInfo(file.name)]);
      });
      doc
        .p(
          `${pkg.id}包是${pkg.name}。${pkg.id}包的说明表，如表3.${i + 1}所示。`
        )
        .h6(`表3.${i + 1} ${pkg.id}包的说明表`)
        .table3l(
          [new Table3lColumn('文件名', 4536), new Table3lColumn('作用', 4536)],
          cells
        );
    }
    doc.save();
  }
}
interface Package {
  id: string;
  name: string;
  files: FileItem[];
}
interface FileItem {
  id: string;
  name: string;
}
