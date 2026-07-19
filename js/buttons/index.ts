import DataTable from 'datatables.net';
import { collection } from './collection';
import {
	columnsToggle,
	columnsVisibility,
	columnToggle,
	columnVisibility,
	colvis,
	colvisGroup,
	colvisRestore
} from './colVis';
import { copy, copyHtml5 } from './copy';
import { csv, csvHtml5 } from './csv';
import { excel, excelHtml5 } from './excel';
import { colOrder, columnOrder } from './order';
import { pageLength } from './pageLength';
import { pdf, pdfHtml5 } from './pdf';
import { print } from './print';
import { spacer } from './spacer';
import { split } from './split';

Object.assign(DataTable.ext.buttons, {
	colOrder,
	columnOrder,
	colvis,
	columnsToggle,
	columnToggle,
	columnsVisibility,
	columnVisibility,
	colvisRestore,
	colvisGroup,
	copy,
	copyHtml5,
	csv,
	csvHtml5,
	excel,
	excelHtml5,
	pdf,
	pdfHtml5,
	pageLength,
	print,
	spacer,
	collection,
	split,
});
