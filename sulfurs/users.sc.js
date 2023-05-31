module.exports = function(sulfur, url){
    sulfur.scenario(
        "Registeration and login",
        "Registeration and login process",
        "show the flow of the registeration and login",)
        .step("Register", ({ set, get, data, pass, fail, faker }) => {
            return {
                docs: {
                    body: {
                        username: "the username of the user to be created",
                        password:  "the password of the user to be created",
                    }
                },
                payload: {
                    url: `${url}/user/register`,
                    method: "post",
                    body: {
                        username: faker.internet.userName(),
                        password: faker.internet.password({ length: 12, memorable: false, pattern: /[A-Za-z1-9!@#$^&*]/ , prefix : 'a1!A'}),
                    }
                },
                rounds: [
                    fail("if username is missing", (pl) => {
                        delete pl.body.username;
                        return pl;
                    }),
                    fail("if password is missing", (pl) => {
                        delete pl.body.password;
                        return pl;
                    }),
                    pass("account created successfully", (pl) => {
                        set('user.password', pl.body.password );
                        return pl;
                    }, ({body})=>{
                        if(!body.ack){return "Expected user to be created"}
                        set('user.username', body.user.username);
                    }),
                ],
    
            }
        })
        .step("login", ({ set, get, data, pass, fail, faker }) => {
            return {
                docs: {
                    body : {
                        username: "username of the user",
                        password:  "the password of the user",
                    }
                },
                payload: {
                    url: `${url}/user/login`,
                    method: "post",
                    body: {
                        username: get('user.username'),
                        password: get('user.password'),
                    }
                },
                rounds: [
                    fail("if the body does not contain username", (pl) => {
                        delete pl.body.username;
                        return pl;
                    }),
                    fail("if the body does not contain password", (pl) => {
                        delete pl.body.password;
                        return pl;
                    }),
                    pass("user is logen in successfully", (pl) => {
                        return pl;
                    }, ({body})=>{
                        if(!body.token){return "Expected to be ok"}
                        set('user.token', body.token)
                    }),
                ],
            }
        })
        .step("get user logged in data", ({ set, get, pass, fail, faker }) => {
            return {
                docs: {
                    headers: {
                        "authorization": "the token of the user"
                    },
                },
                payload: {
                    url: `${url}/user/getUserData`,
                    method: "get",
                    headers: {
                        "authorization": get("user.token"),
                    },
                },
                rounds: [
                    fail("if token is missing", (pl) => {
                        delete pl.headers.authorization;
                        return pl;
                    }),
                    pass("user data is returned successfully", (pl) => {
                        return pl;
                    }, ({body})=>{
                        console.log(body)
                        if(!body.username){return "Expected to have username"}
                    }),
                ]
    
            }
        })

}