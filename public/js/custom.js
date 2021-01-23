//overriding the title for application
Service.Title = "Default Testing Application";


//defining a default alert notification handler
Service.AlertNotification = function(notification){
    swal(notification.notificationType,notification.message,notification.status);
};
//defining a default toaster notification handler
Service.ToasterNotification = function(notification){
    const title = (notification.status === "success")
        ? "Success!" : "Error!";
    VanillaToasts.create({
        title: title,
        text: notification.message,
        type: notification.status,
        timeout: 5000
    });
    jQuery("#vanillatoasts-container").css("z-index",2050);
};
//defining application start process
Service.Bootstrap = function(link){
    Service.ModelData.List = {};

    if(sessionStorage.getItem('GenderList') !== null){
        Service.ModelData.List['Gender'] = JSON.parse(sessionStorage.getItem('GenderList'));
    }
    else{
        const data = [
            { Value: 1, Text: "Male"},
            { Value: 2, Text: "Female"}
        ];
        Service.ModelData.List['Gender'] = data;
        sessionStorage.setItem('GenderList',JSON.stringify(data));
    }
    setTimeout(async function(){
        await Controller.PanelSelect(document.getElementById(`${MainContainer}`));
        await Controller.PanelSelect(link[0]);
    },1000);
};

//launch application when javascript and jQuery is finished loading
jQuery(function(){
    const link = jQuery("<a>");
    link.attr("data-action","form");
    link.attr("data-target","SmallTarget");
    Service.Bootstrap(link);
});
