class Result{
    Status = null;
    Message = null;
    Data = null;
    ActionBtn = null;
    Component = null;
    NotificationType = null;        
}

class Requirement{
    Method = null;
    Request = null;
    Headers = null;
    SuccessHandler = null;
    ErrorHandler = null;
    Component = null;
    ActionBtn = null;
    ResponseType = null;
    Params = null;
    Complete = null;
}

const NotificationType = class {
    Alert = "alert";
    Toaster = "toaster";
    None = "none";
}