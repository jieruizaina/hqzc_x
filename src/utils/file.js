import {
	getFiless
} from '@/api/report/form.js'
class File {
  downFile (data, fileName) {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = window.URL ? window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' })) : window.webkitURL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }));
    link.setAttribute('download', fileName + '.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async idToUrl (ids) {
    const urlData = await getFiless(ids);
     return urlData.data;
  }
}
export default new File();
