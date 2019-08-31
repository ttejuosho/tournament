$(document).ready(function() {
    var tournamentTable;

    function renderMemberTable(data) {
        if (!$.fn.DataTable.isDataTable('#tournamentTable')) {
            tournamentTable = $('#tournamentTable').DataTable({
                dom: "<'row justify-content-between'<'col-sm-12 col-md-2'lB><'col-sm-12 col-md-4'f>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-12 col-md-4'i><'col-sm-12 col-md-8'p>>",
                data: data,
                rowGroup: {
                    startRender: function(rows, group) {
                        return $('<tr/>').append('<td colspan="10" style="background-color: slategray; color: white;">Team Name: ' + group + '</td>');
                    },
                    dataSrc: 'TeamName'
                },
                buttons: ['excel', 'pdf', 'print'],
                rowId: 'id',
                responsive: true,
                order: [
                    [2, 'asc']
                ],
                columns: [{
                        data: null,
                        className: 'id'
                    },
                    {
                        data: 'Name',
                        className: 'Name text-center',
                        render: function(data, type, row, meta) {
                            return '<a href="/member/' + row.id + '">' + data + '</a>';
                        }
                    },
                    {
                        data: 'TeamName',
                        className: 'TeamName text-center',
                        visible: false,
                        searchable: true
                    },
                    {
                        data: 'EmailAddress',
                        className: 'EmailAddress text-center',
                        render: function(data, type, row, meta) {
                            return '<a href="mailto:' + data + '">' + data + '</a>';
                        }
                    },
                    {
                        data: 'PhoneNumber',
                        className: 'PhoneNumber text-center',
                        render: function(data, type, row, meta) {
                            return '<a href="tel:' + data + '">' + data + '</a>';
                        }
                    },
                    {
                        data: 'Amount',
                        className: 'Amount text-center',
                        render: function(data, row, type, meta) {
                            return '$' + data;
                        }
                    },
                    {
                        data: 'id',
                        className: 'text-center',
                        render: function(data, row, type, meta) {
                            return '<a href="/member/' + data + '/update" class="btn btn-warning btn-sm mr-2"><i class="fas fa-edit"></i></a><a href="/member/' + data + '/delete" class="btn btn-danger btn-sm" onclick="return confirm(`Are you sure you want to delete this entry?`)"><i class="fas fa-trash-alt"></i></a>';
                        }
                    }
                ],
                columnDefs: [{
                    searchable: false,
                    orderable: false,
                    targets: 0
                }],
            });

            tournamentTable.on('order.dt search.dt', function() {
                tournamentTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function(cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();

            var column = tournamentTable.column(5);
            $(column.footer()).html(
                column.data().reduce(function(a, b) {
                    return parseInt(a) + parseInt(b);
                })
            );
            $('#TotalText').removeClass('text-center');
            $('#TotalAmount').removeClass('text-center');
        }
    }

    $.ajax({
        url: '/api/members',
        type: 'GET',
        error: function() {
            callback();
        },
        success: function(res) {
            if ($('#tournamentTable').length > 0) {
                renderMemberTable(res);
            }

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
                onChange: function(value) {
                    $("#searchButton").attr("href", "/member/" + $('#searchTerm')[0].selectize.options[value].id);
                }
            });

            $("#TeamName").selectize({
                maxItems: 1,
                create: true,
                valueField: 'TeamName',
                labelField: 'TeamName',
                searchField: ['TeamName'],
                preload: true,
                render: {
                    option: function(item, escape) {
                        return '<div>' + escape(item.TeamName) + '</div>';
                    }
                },
                load: function(query, callback) {
                    if (!query.length) return callback();
                    callback(res);
                }
            });
        }
    });

    $('#teamMember').validate({
        rules: {
            TeamName: {
                required: true,
                normalizer: function(value) { return $.trim(value); }
            },
            Name1: {
                required: true,
                normalizer: function(value) { return $.trim(value); }
            },
            EmailAddress1: {
                required: true,
                normalizer: function(value) { return $.trim(value); }
            },
            PhoneNumber1: {
                required: true,
                normalizer: function(value) { return $.trim(value); }
            },
            Name2: {
                required: true,
                normalizer: function(value) { return $.trim(value); }
            },
            PhoneNumber2: {
                required: true,
                normalizer: function(value) { return $.trim(value); }
            },
        },
        messages: {
            TeamName: "To which Team do you belong again ?",
            Name1: "We need your name",
            EmailAddress1: "Because we might need to reach you via email",
            PhoneNumber1: "Buddha prefers phone calls, sorry",
            Name2: "We need the other team member's name",
            PhoneNumber2: "If youre not available we'll call this number",
        },
        ignore: ':hidden:not([class~=selectized]),:hidden > .selectized, .selectize-control .selectize-input input'
    });

    $('select[name="Amount"]').on('change', function() {
        if($(this).val() == "50"){
            $('.NewTeamMember').toggleClass('d-none');
        } else {
            $('.NewTeamMember').addClass('d-none');
        }

    });
});