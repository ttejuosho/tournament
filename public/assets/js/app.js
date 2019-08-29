$(document).ready(function(){
var tournamentTable;
    function renderMemberTable(data){

        tournamentTable = $('#tournamentTable').DataTable({
            dom: "<'row justify-content-between'<'col-sm-12 col-md-2'lB><'col-sm-12 col-md-4'f>>" +
                 "<'row'<'col-sm-12'tr>>" +
                 "<'row'<'col-sm-12 col-md-4'i><'col-sm-12 col-md-8'p>>",
            data: data,
            rowGroup: {
                startRender: function(rows, group){
                    return $('<tr/>').append('<td colspan="10" style="background-color: slategray; color: white;">' + group + '</td>');
                },
                dataSrc: 'TeamName'
            },
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
            // drawCallback: function () {
            //     var api = this.api();
            //     $( api.table().footer() ).html(
            //       api.column( 5, {page:'current'} ).data().sum()
            //     );
            //   },
              footerCallback: function(row, data, start, end, display) {
                var api = this.api();
               
                api.columns('.sum', {
                  page: 'current'
                }).every(function() {
                  var sum = this
                    .data()
                    .reduce(function(a, b) {
                      var x = parseFloat(a) || 0;
                      var y = parseFloat(b) || 0;
                      return x + y;
                    }, 0);
                  console.log(sum); //alert(sum);
                  $(this.footer()).html(sum);
                });
              },
            rowId: 'id',
            responsive: true,
            order: [[2, 'asc']],
            columns:[
                {
                    data: null,
                    className: 'id'
                },
                {
                    data: 'Name',
                    className: 'Name text-center',
                    render: function(data, type, row, meta){
                        return '<a href="/member/'+ row.id +'">'+ data +'</a>';
                    }
                },
                {
                    data: 'TeamName',
                    className: 'TeamName text-center'
                },
                {
                    data: 'EmailAddress',
                    className: 'EmailAddress text-center'
                },
                {
                    data: 'PhoneNumber',
                    className: 'PhoneNumber text-center'
                },
                {
                    data: 'Amount',
                    className: 'Amount text-center'
                },
                {
                    data: 'id',
                    className: 'text-center',
                    render: function(data,row,type,meta){
                        return '<a href="/member/' + data + '/update" class="btn btn-warning btn-sm mr-2">Edit</a><a href="/member/' + data + '/delete" class="btn btn-danger btn-sm" onclick="return confirm(`Are you sure you want to delete this entry?`)">Delete</a>';
                    }
                }
            ],
            columnDefs: [ {
                searchable: false,
                orderable: false,
                targets: 0
            } ],
        });

        $.fn.dataTable.Api.register( 'sum()', function ( ) {
            return this.flatten().reduce( function ( a, b ) {
                if ( typeof a === 'string' ) {
                    a = a.replace(/[^\d.-]/g, '') * 1;
                }
                if ( typeof b === 'string' ) {
                    b = b.replace(/[^\d.-]/g, '') * 1;
                }    
                return a + b;
            }, 0 );
        });

        tournamentTable.on('order.dt search.dt', function () {
            tournamentTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                cell.innerHTML = i+1;
            });
        }).draw();
    }

    $.ajax({
        url: '/api/members',
        type: 'GET',
        error: function() {
            callback();
        },
        success: function(res) {           
            renderMemberTable(res);
            $("#searchTerm").selectize({
                maxItems: 1,
                create: false,
                valueField: 'Name',
                labelField: 'Name',
                searchField: ['Name', 'TeamName', 'PhoneNumber', 'EmailAddress'],
                preload: true,
                render: {
                    option: function(item, escape) {
                        return '<div>' + escape(item.Name) + '</div>';
                    }
                },
                load: function(query, callback) {
                    if (!query.length) return callback();
                    callback(res);
                },
                onChange: function(value){
                    $("#searchButton").attr("href", "/member/" + $('#searchTerm')[0].selectize.options[value].id);
                }
            });
        }
    });

});