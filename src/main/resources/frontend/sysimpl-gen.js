
const PRESETS = {
    "默认": `-用户
    #登录login.jsp
    +用户名username
    +密码password
    =用户user
    登录控制器LoginController.登录login
    登录服务LoginService.登录login
    用户持久映射UserMapper.按用户名查找findUserById
    成功=跳转到用户主页面
    失败=显示用户名或密码错误

    #注册register.jsp
    +用户名username
    +密码password
    =用户user
    用户控制器UserController.注册register
    用户服务UserService.注册register
    用户持久映射UserMapper.添加用户addUser
    成功=跳转到登录主页面
    失败=显示用户名已存在


-管理员
    #登录login.jsp
    +管理员名adminname
    +密码password
    =管理员admin
    登录控制器LoginController.登录login
    登录服务LoginService.登录login
    管理员持久映射AdminMapper.按管理员名查找findAdminById
    成功=跳转到管理员主页面
    失败=显示管理员名或密码错误

    #注册register.jsp
    +管理员名adminname
    +密码password
    =管理员admin
    管理员控制器AdminController.注册register
    管理员服务AdminService.注册register
    管理员持久映射AdminMapper.添加管理员addAdmin
    成功=跳转到登录主页面
    失败=显示管理员名已存在
    
    
    `,
    "宠物领养管理系统": `-用户
    #登录login.jsp
    +用户名username
    +密码password
    =用户user
    登录控制器LoginController.登录login
    登录服务LoginService.登录login
    用户持久映射UserMapper.按用户名查找findUserById
    成功=跳转到用户主页面
    失败=显示用户名或密码错误

    #注册register.jsp
    +用户名username
    +密码password
    =用户user
    用户控制器UserController.注册register
    用户服务UserService.注册register
    用户持久映射UserMapper.添加用户addUser
    成功=跳转到登录主页面
    失败=显示用户名已存在
    
    #画廊gallery.jsp
    +宠物种类petType
    =宠物知识PetKnowledge
    画廊控制器GalleryController.展示show
    画廊服务GalleryService.展示show
    宠物知识持久映射PetKnowledgeMapper.按种类查找findKnowledgeByType
    成功=显示宠物知识
    失败=显示无相关宠物知识
    
    #领养展示adoptionDisplay.jsp
    +宠物种类petType
    =宠物领养Adoption
    领养展示控制器AdoptionDisplayController.展示show
    领养展示服务AdoptionDisplayService.展示show
    宠物领养持久映射AdoptionMapper.按种类查找findAdoptionByType
    成功=显示可领养的宠物
    失败=显示无相关领养宠物 
    #团队活动teamActivity.jsp
    +活动名称activityName
    =团队活动TeamActivity
    团队活动控制器TeamActivityController.展示show
    团队活动服务TeamActivityService.展示show
    团队活动持久映射TeamActivityMapper.按名称查找findActivityByName
    成功=显示团队活动
    失败=显示无相关团队活动
    
    #成员展示memberDisplay.jsp
    +成员姓名memberName
    =团队成员TeamMember
    成员展示控制器MemberDisplayController.展示show
    成员展示服务MemberDisplayService.展示show
    团队成员持久映射TeamMemberMapper.按姓名查找findMemberByName
    成功=显示团队成员
    失败=显示无相关团队成员
     
    #个人信息修改personalInfoUpdate.jsp
    +用户名username
    +新密码newPassword
    =用户user
    个人信息控制器PersonalInfoController.修改update
    个人信息服务PersonalInfoService.修改update
    用户持久映射UserMapper.更新用户updateUser
    成功=跳转到用户主页面
    失败=显示用户名不存在
     
    #领养申请adoptionApplication.jsp
    +用户名username
    +宠物种类petType
    =领养申请AdoptionApplication
    领养申请控制器AdoptionApplicationController.申请apply
    领养申请服务AdoptionApplicationService.申请apply
    领养申请持久映射AdoptionApplicationMapper.添加申请addApplication
    成功=显示申请已提交
    失败=显示申请提交失败


-管理员
    #登录login.jsp
    +管理员名adminname
    +密码password
    =管理员admin
    登录控制器LoginController.登录login
    登录服务LoginService.登录login
    管理员持久映射AdminMapper.按管理员名查找findAdminById
    成功=跳转到管理员主页面
    失败=显示管理员名或密码错误

    #注册register.jsp
    +管理员名adminname
    +密码password
    =管理员admin
    管理员控制器AdminController.注册register
    管理员服务AdminService.注册register
    管理员持久映射AdminMapper.添加管理员addAdmin
    成功=跳转到登录主页面
    失败=显示管理员名已存在
        
    #评论comment.jsp
    +用户名username
    +宠物种类petType
    +评论内容commentContent
    =评论Comment
    评论控制器CommentController.评论comment
    评论服务CommentService.评论comment
    评论持久映射CommentMapper.添加评论addComment
    成功=显示评论已提交
    失败=显示评论提交失败
    
    #回复reply.jsp
    +用户名username
    +评论idcommentId
    +回复内容replyContent
    =回复Reply
    回复控制器ReplyController.回复reply
    回复服务ReplyService.回复reply
    回复持久映射ReplyMapper.添加回复addReply
    成功=显示回复已提交
    失败=显示回复提交失败
     
    #管理员登录adminLogin.jsp
    +管理员名adminName
    +密码password
    =管理员Admin
    管理员控制器AdminController.登录login
    管理员服务AdminService.登录login
    管理员持久映射AdminMapper.按管理员名查找findAdminByName
    成功=跳转到管理员主页面
    失败=显示管理员名或密码错误
     
    #用户信息管理userInfoManage.jsp
    +用户名username
    =用户User
    用户信息控制器UserInfoManageController.管理manage
    用户信息服务UserInfoManageService.管理manage
    用户持久映射UserMapper.按用户名查找findUserByName
    成功=显示用户信息
    失败=显示无相关用户信息
     
    #管理员信息管理adminInfoManage.jsp
    +管理员名adminName
    =管理员Admin
    管理员信息控制器AdminInfoManageController.管理manage
    管理员信息服务AdminInfoManageService.管理manage
    管理员持久映射AdminMapper.按管理员名查找findAdminByName
    成功=显示管理员信息
    失败=显示无相关管理员信息
     
    #宠物信息管理petInfoManage.jsp
    +宠物种类petType
    =宠物Pet
    宠物信息控制器PetInfoManageController.管理manage
    宠物信息服务PetInfoManageService.管理manage
    宠物持久映射PetMapper.按种类查找findPetByType
    成功=显示宠物信息
    失败=显示无相关宠物信息
     
    #领养管理adoptionManage.jsp
    +用户名username
    +宠物种类petType
    =领养Adoption
    领养管理控制器AdoptionManageController.管理manage
    领养管理服务AdoptionManageService.管理manage
    领养持久映射AdoptionMapper.按用户名和种类查找findAdoptionByUsernameAndType
    成功=显示领养信息
    失败=显示无相关领养信息
     
    #评论管理commentManage.jsp
    +用户名username
    +宠物种类petType
    =评论Comment
    评论管理控制器CommentManageController.管理manage
    评论管理服务CommentManageService.管理manage
    评论持久映射CommentMapper.按用户名和种类查找findCommentByUsernameAndType
    成功=显示评论信息
    失败=显示无相关评论信息
     
    #团队活动管理teamActivityManage.jsp
    +活动名称activityName
    =团队活动TeamActivity
    团队活动管理控制器TeamActivityManageController.管理manage
    团队活动管理服务TeamActivityManageService.管理manage
    团队活动持久映射TeamActivityMapper.按名称查找findActivityByName
    成功=显示团队活动信息
    失败=显示无相关团队活动信息

`,
    "汽车销售管理系统": `-用户
    #登录login.jsp
    +用户名username
    +密码password
    =用户user
    登录控制器LoginController.登录login
    登录服务LoginService.登录login
    用户持久映射UserMapper.按用户名查找findUserById
    成功=跳转到用户主页面
    失败=显示用户名或密码错误

    #注册register.jsp
    +用户名username
    +密码password
    =用户user
    用户控制器UserController.注册register
    用户服务UserService.注册register
    用户持久映射UserMapper.添加用户addUser
    成功=跳转到登录主页面
    失败=显示用户名已存在
    #浏览汽车browseCar.jsp
    +汽车类型carType
    =汽车Car
    汽车控制器CarController.浏览browse
    汽车服务CarService.浏览browse
    汽车持久映射CarMapper.按类型查找findCarByType
    成功=显示汽车信息
    失败=显示无相关汽车信息
    
    #购买汽车buyCar.jsp
    +用户名username
    +汽车idcarId
    =购买记录PurchaseRecord
    购买控制器BuyController.购买buy
    购买服务BuyService.购买buy
    购买持久映射PurchaseRecordMapper.添加记录addRecord
    成功=显示购买成功
    失败=显示购买失败

-管理员
    #登录login.jsp
    +管理员名adminname
    +密码password
    =管理员admin
    登录控制器LoginController.登录login
    登录服务LoginService.登录login
    管理员持久映射AdminMapper.按管理员名查找findAdminById
    成功=跳转到管理员主页面
    失败=显示管理员名或密码错误
    #添加汽车addCar.jsp
    +汽车信息carInfo
    =汽车Car
    汽车控制器CarController.添加add
    汽车服务CarService.添加add
    汽车持久映射CarMapper.添加汽车addCar
    成功=显示添加成功
    失败=显示添加失败
    
    #删除汽车deleteCar.jsp
    +汽车idcarId
    =汽车Car
    汽车控制器CarController.删除delete
    汽车服务CarService.删除delete
    汽车持久映射CarMapper.删除汽车deleteCar
    成功=显示删除成功
    失败=显示删除失败
`
}
/**
 *
 * @type {RoleImpl[]}
 */
let impls = []
class RoleImpl{
    /**
     *
     * @param name{string}
     * @param funcs{FuncImpl[]}
     */
    constructor(name,funcs) {
        this.name=name;
        this.funcs=funcs;
    }
}
class Invoke{
    /**
     *
     * @param clazz{string}
     * @param method{string}
     */
    constructor(clazz,method) {
        this.clazz=clazz;this.method=method;
    }
}
class FuncImpl{
    /**
     *
     * @param name {string}
     * @param page{string}
     * @param entity{string}
     * @param inputs{string[]}
     * @param invokes{Invoke[]}
     * @param success{string}
     * @param fail{string}
     */
    constructor(name,page,entity,inputs,invokes,success,fail) {
        this.name=name;this.page=page;this.entity=entity;
        this.inputs=inputs;this.invokes=invokes;this.success=success;this.fail=fail;
    }
    intro(roleName,imageIndex){
        return `${roleName}跳转到${this.page}，进入到${this.name}界面。用户在${this.name}界面可以进行${this.name}操作，对应${this.entity}实体。
${this.name}界面，如图2.${imageIndex}所示。
        `.replaceAll("\n","")

    }
    impl(roleName){
        return `在${this.page}中定义好${this.name}界面，${roleName}访问${this.page}页面可以进行${this.name}操作，在${this.name}页面上，
${roleName}通过input组件输入内容：${this.inputs.map(s=>matchIdName(s).name).join("、")}，
并对每个组件赋予相应的name属性：${this.inputs.map(s=>matchIdName(s).id).join("、")}。
输入完成后，点击${this.name}按钮提交${this.name}信息，
将所有输入的内容通过提交表单HTTP请求，后端收到请求后，取出请求内容并构建${this.entity}对象，${this.invokes.map(inv => `传递给${inv.clazz}类，调用${inv.method}方法`).join("，再")}。
执行成功后，${this.success}；执行失败后，${this.fail}。`.replaceAll("\n","")

    }
}

/**
 *
 * @param dsl{string}
 */
function parse(dsl){
    impls.length=0
    let lines = dsl.split('\n');
    let currentModule = null;
    let currentFunc = null;

    for (let line of lines) {
        line = line.trim()
        if (line.startsWith('-')) {
            currentModule = new RoleImpl(line.slice(1).trim(), []);
            impls.push(currentModule);
        } else if (line.startsWith('#')) {
            let match = matchIdName(line.slice(1).trim());
            currentFunc = new FuncImpl(match.name, match.id, '', [], [], '', '');
            currentModule.funcs.push(currentFunc);
        } else if (line.startsWith('+')) {
            currentFunc.inputs.push(line.slice(1).trim());
        } else if (line.startsWith('=')) {
            currentFunc.entity = line.slice(1).trim();
        } else if (line.includes('.')) {
            let split = line.split('.');
            currentFunc.invokes.push(new Invoke(split[0], split[1]));
        } else if (line.startsWith('成功=')) {
            currentFunc.success = line.slice(3).trim();
        } else if (line.startsWith('失败=')) {
            currentFunc.fail = line.slice(3).trim();
        }
    }
    return impls;
}
function updatePreview(dsl){
    let impls = parse(dsl);
    let div = $('#preview'); // replace 'yourDivId' with the id of your div
    let div2 = $('#preview2'); // replace 'yourDivId' with the id of your div
    div.empty();
    div2.empty();

    for (let module of impls) {
        div.append('<hr>')
        div.append(`模块 ${module.name} <br>`);
        for (let func of module.funcs) {
            div.append(`&emsp;功能 ${func.name}<br>` );
            div.append(`&emsp;页面 ${func.page}<br>` );
            div.append(`&emsp;输入 ${func.inputs.join(', ')}<br>` );
            div.append(`&emsp;实体 ${func.entity}<br>` );
            for (let invoke of func.invokes) {
                div.append(`&emsp;&emsp;调用 ${invoke.clazz} 类的方法 ${invoke.method}<br>` );
            }
            div.append(`&emsp;成功 ${func.success}<br>` );
            div.append(`&emsp;失败 ${func.fail}<br>` );

        }
    }
    div2.append(toDocDsl())
}
function toDocDsl(){
    let dsl = ""
    let implIndex = 2;
    let imageIndex = 2;
    for (let impl of impls) {
        dsl += `h2 2.${implIndex} ${impl.name}端模块的实现\n`
        let funcIndex = 1;
        for (let func of impl.funcs) {
            dsl += `h3 2.${implIndex}.${funcIndex} ${func.name}功能的实现\n`
            dsl += `p ${func.intro(impl.name,imageIndex)}\n`
            dsl += `h6 图2.${imageIndex} ${func.name}界面\n`
            dsl += `p 功能实现：${func.impl(impl.name)}\n`
            ++imageIndex;
            ++funcIndex;
        }


        ++implIndex;
    }
    return dsl;
}
window.onload = function() {
    let select = document.getElementById('presets');

    // Add options to the select element
    for (let key in PRESETS) {
        let option = document.createElement('option');
        option.text = key;
        option.value = PRESETS[key];
        select.add(option);
    }

    // When an option is selected
    select.onchange = function() {
        let textarea = document.getElementById('dsl-area');
        textarea.value = this.value;
        updatePreview(this.value)
    }
}