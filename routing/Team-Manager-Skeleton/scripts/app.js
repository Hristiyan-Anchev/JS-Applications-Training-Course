import {
    editTeam,
    joinTeam,
    createTeam,
    getAllTeams,
    getTeam,
    loginUser,
    logoutUser,
    registerUser,
    removeMemberFromTeam
} from "./requester.js";


window.addEventListener("load", main);

function main() {
    let partials = {
        header: "../templates/common/header.hbs",
        footer: "../templates/common/footer.hbs",
        loginForm: "../templates/login/loginForm.hbs",
        registerForm: "../templates/register/registerForm.hbs",
        team: "../templates/catalog/team.hbs",
        teamControls: "../templates/catalog/teamControls.hbs",
        teamMember: "../templates/catalog/teamMember.hbs",
        createForm: "../templates/create/createForm.hbs",
        editForm: "../templates/edit/editForm.hbs"
    }

    let mainTemplates = {
        home: "../templates/home/home.hbs",
        about: "../templates/about/about.hbs",
        loginPage: "../templates/login/loginPage.hbs",
        registerPage: "../templates/register/registerPage.hbs",
        teamCatalog: "../templates/catalog/teamCatalog.hbs",
        teamDetails: "../templates/catalog/details.hbs",
        createPage: "../templates/create/createPage.hbs",
        editPage: "../templates/edit/editPage.hbs"
    }


    function passwordValidator(passwd, repeatPasswd) {
        return Array.from(arguments).map(p => {
            return p.trim()
        }).every(p => {
            return p === passwd
        });
    }

    function usernameValidator(username) {
        return username.trim() !== "";
    }

    function syncExecutionData(object) {
        object.username = globalUserObject().getUsername();
        object.loggedIn = globalUserObject().getToken();
        object.objectId = globalUserObject().getCurrentTeam();
        object.currentTeam = globalUserObject().getCurrentTeam();
        object.createdTeams = globalUserObject().getCreatedTeams();
    }

    function globalUserObject() {
        let username = window.localStorage.key(0) || {};

        function getUserObject() {
            return JSON.parse(window.localStorage.getItem(username) || "{}");
        }

        function setProperties(propertiesObject) {
            let userObject = getUserObject();
            Object.assign(userObject, propertiesObject);
            window.localStorage.setItem(username, JSON.stringify(userObject));
        }

        function getProperty(propertyName) {
            return getUserObject()[propertyName]
        }

        return {
            setProperties,
            getProperty,

            loginUser: (username, token, currentTeam, createdTeams, objectId) => {
                window.localStorage.setItem(username, JSON.stringify({
                    username,
                    objectId,
                    token,
                    createdTeams,
                    currentTeam
                }));
            },
            logoutUser: () => {
                window.localStorage.removeItem(username);
            },
            getToken: () => {
                return getUserObject().token;
            },
            getObjectId: () => {
                return getUserObject().objectId;
            },
            isOnTeam: (teamToCheck) => {
                if (getUserObject().currentTeam) {
                    return getUserObject().currentTeam === teamToCheck
                }
                return false;
            },
            isAuthorOf: (team) => {
                if (getUserObject().createdTeams) {
                    return getUserObject().createdTeams.find(t => t === team);
                }
                return false;
            },
            getUsername: () => {
                return getUserObject().username;
            },
            getCurrentTeam: () => {
                return getUserObject().currentTeam;
            },
            getCreatedTeams: () => {
                return getUserObject().createdTeams;
            },
            addCreatedTeam: (newTeam) => {
                let createdTeams = getUserObject().createdTeams;
                if (Array.isArray(createdTeams)) {
                    createdTeams.push(newTeam);
                    setProperties({createdTeams})
                } else {
                    createdTeams = [newTeam];
                    setProperties({createdTeams})
                }
            },
            removeCreatedTeam: (targetTeam) => {
                let createdTeams = getUserObject().createdTeams;
                if (Array.isArray(createdTeams)) {
                    createdTeams = createdTeams.filter(t => {
                        return t !== targetTeam;
                    });
                    setProperties({createdTeams});
                }
            },
        }
    }

    async function loadHome(ctx) {
        syncExecutionData(ctx.app.globalExecutionData);
        try {
            await ctx.loadPartials(partials)
                .partial(mainTemplates.home,
                    ctx.app.globalExecutionData);
        } catch (e) {
            console.log(e.message);
        }
    }

    async function loadAbout(ctx) {
        syncExecutionData(ctx.app.globalExecutionData);
        try {
            await ctx.loadPartials(partials)
                .partial(mainTemplates.about,
                    ctx.app.globalExecutionData);
        } catch (e) {
            console.log(e.message);
        }
    }

    async function loadLogin(ctx) {
        syncExecutionData(ctx.app.globalExecutionData);
        if (ctx.app.globalExecutionData.loggedIn) {
            ctx.redirect("#/home");
            return;
        }
        try {
            await ctx.loadPartials(partials).partial(mainTemplates.loginPage,
                ctx.app.globalExecutionData);
        } catch (e) {
            console.log(e.message);
        }

    }

    async function loadRegister(ctx) {
        syncExecutionData(ctx.app.globalExecutionData);
        if (ctx.app.globalExecutionData.loggedIn) {
            ctx.redirect("#/home");
            return;
        }
        try {
            await ctx.loadPartials(partials)
                .partial(mainTemplates.registerPage,
                    ctx.app.globalExecutionData);
        } catch (e) {
            console.log(e);
        }
    }

    async function loadCatalog(ctx) {
        syncExecutionData(ctx.app.globalExecutionData);
        try {
            ctx.app.globalExecutionData.teams =
                await getAllTeams();

            await ctx.loadPartials(partials)
                .partial(mainTemplates.teamCatalog,
                    ctx.app.globalExecutionData);
        } catch (e) {
            console.log(e.message);
        }
    }


    async function loadCreatePage(ctx) {
        try {
            syncExecutionData(ctx.app.globalExecutionData);
            await ctx.loadPartials(partials)
                .partial(mainTemplates.createPage,
                    ctx.app.globalExecutionData);
        } catch (e) {
            console.log(e.message);
        }

    }

    async function loadTeamDetails(ctx) {
        try {
            let teamId = ctx.params.objectId.substring(1);
            let teamDetailsObject = await getTeam(teamId);

            ctx.app.globalExecutionData.name = teamDetailsObject.name;
            ctx.app.globalExecutionData.members = teamDetailsObject.members;
            ctx.app.globalExecutionData.description = teamDetailsObject.description;
            ctx.app.globalExecutionData.isAuthor = globalUserObject()
                .getObjectId() === teamDetailsObject.ownerId;
            ctx.app.globalExecutionData.isOnTeam =
                globalUserObject().isOnTeam(teamDetailsObject.objectId);
            ctx.app.globalExecutionData.objectId = teamDetailsObject.objectId;

            await ctx.loadPartials(partials)
                .partial(mainTemplates.teamDetails,
                    ctx.app.globalExecutionData);
        } catch (e) {
            console.log(e.message);
        }
    }

    async function loadEdit(ctx) {
        syncExecutionData(ctx.app.globalExecutionData);
        ctx.app.globalExecutionData.objectId = ctx.params.objectId.substring(1);
        try {
            await ctx.loadPartials(partials)
                .partial(mainTemplates.editPage
                    , ctx.app.globalExecutionData);
        } catch (e) {
            console.log(e.message);
        }


    }

    //handlers
    async function registerUserHandler(ctx) {
        let {username, password, repeatPassword} = ctx.params;
        try {
            if (passwordValidator(password, repeatPassword) &&
                usernameValidator(username)) {
                await registerUser(username, password);
                ctx.redirect("#/login");
            } else {
                alert("Please check the information in the input fields");
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    async function loginUserHandler(ctx) {
        let {username, password} = ctx.params;

        if (ctx.app.globalExecutionData.loggedIn) {
            ctx.redirect("#/home");
            alert(`You have already logged in as: ${globalUserObject().getUsername()}`);
            return;
        }
        try {
            let loginResponseData = await loginUser(username, password);
            ctx.app.globalExecutionData.loggedIn = loginResponseData["user-token"];
            ctx.app.globalExecutionData.currentTeam = loginResponseData.currentTeam;
            ctx.app.globalExecutionData.username = loginResponseData.username;

            globalUserObject().loginUser(username,
                loginResponseData["user-token"],
                loginResponseData.currentTeam,
                loginResponseData.createdTeams,
                loginResponseData.objectId);
        } catch (e) {
            console.log(e.message);
        }
        ctx.redirect("#/home");
    }

    async function logoutUserHandler(ctx) {
        syncExecutionData(ctx.app.globalExecutionData);
        let userToken = globalUserObject().getToken();
        if (userToken) {
            globalUserObject().logoutUser();
        }
        try {
            await logoutUser(userToken);
        } catch (e) {
            console.log(e.message)
        }
        ctx.redirect("#/home");
    }

    async function handleCreateTeam(ctx) {
        let {name, comment} = ctx.params;
        let userToken = ctx.app.globalExecutionData.loggedIn;
        let initialMember = JSON.stringify([{username: globalUserObject().getUsername()}]);
        try {
            let newTeamObj = await createTeam(name, comment, initialMember, userToken);
            globalUserObject()
                .setProperties({currentTeam: newTeamObj.objectId});
            globalUserObject().addCreatedTeam(newTeamObj.objectId);
        } catch (e) {
            console.log(e.message);
        }

        ctx.redirect("#/catalog");
    }

    async function handleLeave(ctx) {
        ctx.app.globalExecutionData.isOnTeam = false;
        try {
            await removeMemberFromTeam(globalUserObject().getCurrentTeam(),
                globalUserObject().getUsername(),
                globalUserObject().getToken(),
                globalUserObject().getObjectId());

            globalUserObject().setProperties({currentTeam: ""});
        } catch (e) {
            console.log(e.message);
        }

        ctx.redirect("#/catalog");
    }

    async function handleJoinTeam(ctx) {
        if (ctx.app.globalExecutionData.currentTeam) {
            alert(`You first need to leave your current team, before joining another one!!!`);
            return;
        }
        let objectId = ctx.params.objectId.substring(1);
        globalUserObject().setProperties({currentTeam: objectId});
        ctx.app.globalExecutionData.currentTeam = objectId;
        try {
            await joinTeam(objectId, globalUserObject().getUsername()
                , globalUserObject().getObjectId()
                , globalUserObject().getToken());
        } catch (e) {
            console.log(e.message);
        }
        ctx.redirect("#/catalog");
    }

    async function handleEdit(ctx) {
        let {name, comment, objectId} = ctx.params;
        objectId = objectId.substring(1);

        if (name.trim() !== "" && comment.trim() !== "") {
            try {
                await editTeam(objectId, name, comment);
            } catch (e) {
                console.log(e.message);
            }
        }
        ctx.redirect(`#/catalog/:${objectId}`);
    }

    let app = Sammy("#main", function (appContext) {
        this.use("Handlebars", "hbs");
        appContext.globalExecutionData = {}
        syncExecutionData(appContext.globalExecutionData);

        this.get("#/home", loadHome);
        this.get("#/", loadHome);
        this.get("#/about", loadAbout);
        this.get("#/login", loadLogin);
        this.get("#/logout", logoutUserHandler);
        this.get("#/register", loadRegister);
        this.get("#/create", loadCreatePage);
        this.get("#/catalog", loadCatalog);
        this.get("#/catalog/:objectId", loadTeamDetails)
        this.get("#/leave", handleLeave);
        this.get("#/join/:objectId", handleJoinTeam);
        this.get("#/edit/:objectId", loadEdit);

        //passing ctx as an argument to the handler could be omitted
        this.post("#/register", (ctx) => {
            registerUserHandler.call(ctx, ctx)
        });
        this.post("#/create", (ctx) => {
            handleCreateTeam.call(ctx, ctx)
        });
        this.post("#/login", (ctx) => {
            loginUserHandler.call(ctx, ctx)
        });
        this.post("#/edit/:objectId", (ctx) => {
            handleEdit.call(ctx, ctx)
        });

    });

    app.run("#/");
}