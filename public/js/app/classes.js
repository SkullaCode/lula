class Result{
    Code = null;
    Status = null;
    Message = null;
    Data = null;
    ActionBtn = null;
    Component = null;
    NotificationType = null;        
}

class Requirement{
    Site = "";
    Method = null;
    /** @deprecated*/ //always use METHOD!!!
    Request = "POST";
    Notification = "true";
    Headers = [];
    SuccessHandler = null;
    ErrorHandler = null;
    Component = null;
    ActionBtn = null;
    ResponseType = null;
    Params = new FormData();
    Complete = null;
}