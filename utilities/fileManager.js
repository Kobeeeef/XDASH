import { saveAs } from 'file-saver'
import xlsx, { utils } from 'xlsx'
const saveAsExcelFile = (buffer, fileName) => {

    import('file-saver').then((module) => {

            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });

            saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);

    });
};
const exportExcel = (filename, data) => {

        const worksheet = utils.json_to_sheet(data);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, filename);

};

export { saveAsExcelFile, exportExcel }
