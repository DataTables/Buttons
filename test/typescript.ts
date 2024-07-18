
import DataTable, {Api} from 'datatables.net';
import "../types/types";
import {expectType} from 'tsd';

new DataTable('#myTable', {
    layout: {
        top: 'buttons',
        top1: {
            buttons: [
                'copy', 'excel', 'pdf'
            ]
        },
        top2: {
            buttons: [
                {
                    extend: 'copy',
                    fieldSeparator: '\t'
                }
            ]
        },
        top3: [
            {
                buttons: [{
                    extend: "collection",
                    align: "button-right",
                    background: false,
                    fade: 0,
                    className: "btnTableOption",
                    text: "Test collection",
                    buttons: [{
                        text: "test 01",
                        action: function(e, dt, node, config) {
                            alert('test 01');
                        }
                    }]
                }]
            }
        ],
        top5: [
            {
                buttons: [{
                    extend: "csv",
                    extension: '.tsv',
                    fieldSeparator: '\t'
                }]
            }
        ],
    }
});
