window.Controller.Home = function () {

    const init = function () {
        window.Service.Data.AddMethod("home-listing", function (component) {
                window.Service.ServerRequest("Home/Data",{},"GET",function(data){
                    window.Service.ModelData["listing"] = [];
                    if(data.data.length > 0){
                        data.data.forEach(function(item){
                            window.Service.ModelData["listing"][item.ID] = item;
                        })
                    }
                    const table = jQuery("#listing-table");
                    table.dataTable({
                        data: data.data,
                        columns: [
                            { title: "Rendering Engine", data: "RenderEngine" },
                            { title: "Browser", data: "Browser" },
                            { title: "Platform(s)", data: "Platform" },
                            { title: "Engine Version", data: "EngineVersion" },
                            { title: "CSS Grade", data: "CssGrade" },
                            {
                                name : "options",
                                orderable: false,
                                searchable : false,
                                render: function(data, type, row, meta){

                                    return "";
                                }
                            }
                        ]
                    });
                });
        });
    };

    return {
        Init: init
    };
}();

window.Controller.Home.Init();