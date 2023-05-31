
# Sulfur

## Introduction

Welcome to Sulfur, a library designed to simplify the process of integration testing and documenting endpoints.

Sulfur provides a simple and intuitive API to help developers test their endpoints and generate documentation automatically. With Sulfur, you can easily create tests for your API endpoints, and generate documentation that can be shared with your team or published to the web.

Sulfur is compatible with a javascript, making it easy to integrate with your codebase, Sulfur can help you streamline your testing and documentation process.

In this documentation, you'll find everything you need to get started with Sulfur, including API documentation, examples, and instructions for integrating Sulfur with your project. We'll walk you through the basics of using Sulfur, and provide tips and tricks for getting the most out of this powerful library. Let's get started!

## Getting started

Sulfur is a JavaScript testing framework designed to help developers build and run functional tests for web applications and services. It provides a simple API for defining tests as scenarios with steps that represent actions or interactions with the application being tested. It supports a range of built-in functions for checking responses, including assertions of response headers, and response bodies. Sulfur also supports data-driven testing and parallel testing to speed up the testing process, and integrates with popular test reporting tools and frameworks for easy reporting and tracking of test results. Overall, Sulfur is a flexible and powerful testing framework that provides developers with the tools and features they need to build and run comprehensive tests for web applications.

## Simple usage

1. Clone the Sulfur repository from GitHub to your local machine.
2. Define a new scenario using the `sulfur.scenario` method, which takes a title, description, and documentation as arguments.
3. Define steps within the scenario using the `scenario.step` method, which takes a function that returns an object with properties for the HTTP request to be made and expected responses.
4. Use built-in Sulfur functions to check responses, such as pass or fail to check HTTP status codes.
5. Run the test using the `sulfur.run` method, which takes the scenario as an argument.

```jsx
const Sulfur = require('./sulfur.min.js');
const url = "<http://localhost:3000>";

const sulfur = new Sulfur({
    title: "Urchin API",
    version: "1.0.0",
    desc: "a boilerplat engine for building swift backend apps"
});

require('../sulfurs/users.sc.js')(sulfur, url);

sulfur.run();

```

```jsx
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
                        set('user.token', body.data.token)
                    }),
                ]
    
            }
        })

}

```

Example of sulfur run in docs.html

![enter image description here](https://mediafusion.spacejat.com/api/fm/v1_download?file=U2NyZWVuc2hvdCAyMDIzLTA1LTI1IGF0IDMuMzcuMjYgUE06NUNrMzo4MDkxMDppbWFnZS9wbmc=.png&transformer=original)

![enter image description here](https://mediafusion.spacejat.com/api/fm/v1_download?file=U2NyZWVuc2hvdCAyMDIzLTA1LTMxIGF0IDIuNDQuMzcgUE06Y1FEcTo3NDQwMDppbWFnZS9wbmc=.png&transformer=original)

**Scenarios**

To use Sulfur, you need to create a scenario by calling the `sulfur.scenario()` function, which takes three arguments: the name of the scenario, a description of the scenario, and a detailed description that defines the steps of the scenario.

```jsx
const sulfur = require('sulfur');

sulfur.scenario('Scenario name ', 'Description of my scenario', 'Detailed descriptio.')

```

**Steps**

Each step of the scenario is defined using the `step()` method, which takes two arguments: the name of the step and a callback function that defines the payload and validation checks of the step.

```jsx
sulfur.scenario('My scenario', 'Description of my scenario', 'Detailed descriptio.').step('My step', ({ set, get, data, pass, fail, faker }) {
    // Define the payload and validation checks of the step
        return {
           docs: {
             body: {
               email: "the email of the user to be created",
               password:  "the password of the user to be created",
               firstName:  "the first name of the user to be created",
                lastName: "the last name of the user to be created",
              }
          },
          payload: {
            url: `${formUrl}/user/v1_createUser`,
            method: "post",
            body: {
               email: faker.internet.email(),
               password: faker.internet.password({ length: 12}),
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName(),
            }
         },
    });
  }); 

```

`payload` object is used to define the HTTP request to be sent for each step in a scenario. It includes the URL, method, headers, and body of the request.

- `url`: This attribute specifies the endpoint (i.e., the URL) that the HTTP request should be sent to.
- `method`: This attribute specifies the HTTP method to use for the request (e.g., `GET`, `POST`, `PUT`, `DELETE`, etc.).
- `headers`: This attribute is an object that defines any headers that should be included in the HTTP request. Headers are used to provide additional information about the request (e.g., the content type of the request body, authorization tokens, etc.).
- `params`: This attribute is an object that defines any query parameters that should be included in the HTTP request. Query parameters are used to filter, sort, or otherwise modify the response from an API.
- `body`: This attribute is an object that defines the data to be sent in the request body. The request body is used to send data to the server (e.g., when creating a new resource, updating an existing resource, etc.). The format of the request body depends on the content type specified in the `headers` attribute (e.g., JSON, XML, form data, etc.).

the `docs` object is used to provide documentation for the payload attributes of each step.

**Setting a Variable to use it in different steps**

To set a variable in Sulfur, you can use the `set()` method, which takes two arguments:

1. A string representing the variable name and path, using dot notation. For example, `"user.name"` represents a variable named `a` in an object called user.
2. The value to assign to the variable.

Here's an example of how to set a variable using the `set()` method:

```jsx
sulfur.set('user.name', 'Bahi Hussein')

```

In this example, we set a variable named `a` in an object called user to the string value `"Bahi Hussein"`.

### getting a variable

To get a variable in Sulfur, you can simply reference it using the dot notation. For example, to get the value of the `user.name` variable we set earlier, we can use the following code:

```jsx
get('user.name');

```

In this example, we get the value of the name variable in the user object, and assign it to variable called [user.name](http://user.name).

### getting a global variable from different scenarios

To get a global variable from different scenarios use the scenario name the global variable is declared in For example

```jsx
data.get('scenario-name.user.name');

```

**Rounds**

In Sulfur, the `rounds` array is used to define a set of pass and fail functions that determine whether a step is successful or not. The pass and fail functions are defined as callbacks that take the current payload object as input and return either the modified payload object (in the case of a pass function) or an error message (in the case of a fail function).

Here's an example of how you might define rounds with pass and fail functions:

```jsx
.step("Register", ({ set, get, data, pass, fail, faker }) => {
            return {
                docs: {
                    body: {
                        email: "the email of the user to be created",
                        password:  "the password of the user to be created",
                        firstName:  "the first name of the user to be created",
                        lastName: "the last name of the user to be created",
                    },
          params : {
                        :  'link used to verify account'
                    },
          headers: {
                        authorization: "a user valid token"
                    }
                },
                payload: {
                    url: `${formUrl}/user/v1_createUser`,
                    method: "post",
                    body: {
                        email: faker.internet.email(),
                        password: faker.internet.password({ length: 12, memorable: false, pattern: /[A-Za-z1-9!@#$^&*]/ , prefix : 'a1!A'}),
                        firstName: faker.person.firstName(),
                        lastName: faker.person.lastName(),
                    },
          params : {
                        link :  get('user.link')
                    },
          headers: {
                        authorization: `bearer ${data.get('registeration-and-login.user.token')}`
                    },
                },
                rounds: [
                    fail("if email is missing", (pl) => {
                        delete pl.body.email;
                        return pl;
                    }),
                    fail("if firstname is missing", (pl) => {
                        delete pl.body.firstName;
                        return pl;
                    }),
                    fail("if lastname is missing", (pl) => {
                        delete pl.body.lastName;
                        return pl;
                    }),
                    fail("if passwor is missing", (pl) => {
                        delete pl.body.password;
                        return pl;
                    }),
                    pass("create account", (pl) => {
                        set('user.password', pl.body.password);
                        return pl;
                    }, ({body})=>{
                        if(!body.data._id){return "Expected to have a create id"}
                        set('user.link', body.data.link);
                        set('user.email', body.data.email);
                        set('user.firstName', body.data.firstName);
                        set('user.lastName', body.data.lastName);
                    }),
                ],
    
            }
        })

```

In this example we define “Create user” step that sends a POST request to create a new user. The `payload` object contains the details of the request, including the URL, method, headers, and request body

The `rounds` array contains three functions: two fail functions and one pass function. The fail functions check for missing email and password fields in the request body, and The pass function simply returns the payload object, indicating that the step was successful.

**Example**

Here's an example of how to define a scenario using Sulfur:

```jsx
const url = '<https://example.com>';

module.exports = function() {
  sulfur.scenario('Registration and login', 'Registeration and login process', 'Show the flow of the registration and login')
    .step('Register', ({ set, get, data, pass, fail, faker }) => {
      // Define the payload and rounds for this step
    })
    .step('Login', ({ set, get, data, pass, fail, faker }) => {
      // Define the payload and rounds for this step
    });
};

```

In this example, we define a scenario called "Registration and login," which consists of two steps: "Register" and "Login.”

Each step takes a callback function that defines the payload and rounds for the step. The payload is an object that specifies the HTTP request to be sent, including the URL, method, headers, and body. The rounds are an array of pass or fail functions that define the expected outcome for the step.

Here's an example of how to define the payload and rounds for the "Register" step:

```jsx
.step('Register', ({ set, get, data, pass, fail, faker }) => {
  return {
    payload: {
      url: `${url}/user/v1_createUser`,
      method: 'post',
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      },
    },
    rounds: [
      fail('if email is missing', (pl) => {
        delete pl.body.email;
        return pl;
      }),
      fail('if password is missing', (pl) => {
        delete pl.body.password;
        return pl;
      }),
      pass('create account', (pl) => {
        set('user.password', pl.body.password);
        return pl;
      }, ({ body }) => {
        if (!body.data._id) {
          return 'Expected to have a create id';
        }
       set('user.email', body.data.email);
       set('user.firstName', body.data.firstName);
       set('user.lastName', body.data.lastName);
      }),
    ],
  };
})

```

In this example, we define the payload for the "Register" step to send a POST request to the `/user/v1_createUser` endpoint with a randomly generated email, password, first name, and last name. We also define a set of rounds that check for missing email and password fields, and verify that the account was created successfully.
