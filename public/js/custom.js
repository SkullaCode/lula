//overriding the title for application
Service.Title = "Default Testing Application";


//defining a default alert notification handler
/**
 *
 * @param {Result} notification
 */
Service.AlertNotification = function(notification){
    swal(notification.NotificationType,notification.Message,notification.Status);
};
//defining a default toaster notification handler
/**
 *
 * @param {Result} notification
 */
Service.ToasterNotification = function(notification){
    const title = (notification.Status === "success")
        ? "Success!" : "Error!";
    VanillaToasts.create({
        title: title,
        text: notification.Message,
        type: notification.Status,
        timeout: 5000
    });
    jQuery("#vanillatoasts-container").css("z-index",2050);
};

//defining application start process
//overriding default bootstrap process
Service.Bootstrap = function(link){
    Service.ModelData.Lists['Option'] = [
        {
            Text:"Start",
            Value:1
        },
        {
            Text:"Stop",
            Value:2
        }
    ];
    Service.ModelData.Lists['ModuleOne'] ={
        "ModuleTwo":[
            {
                Text:"Module Start",
                Value:1
            },
            {
                Text:"Module Stop",
                Value:2
            }
        ]
    };


    if(sessionStorage.getItem('GenderList') !== null){
        Service.ModelData.Lists['Gender'] = JSON.parse(sessionStorage.getItem('GenderList'));
    }
    else{
        const data = [
            { Value: 1, Text: "Male"},
            { Value: 2, Text: "Female"}
        ];
        Service.ModelData.Lists['Gender'] = data;
        sessionStorage.setItem('GenderList',JSON.stringify(data));
    }
    setTimeout(async function(){
        await Controller.PanelSelect(document.getElementById(`${MainContainer}`));
        await Controller.PanelSelect(link[0]);
    },1000);
};

Service.Modification.SelectedLink = function(component,actionBtn){

};
