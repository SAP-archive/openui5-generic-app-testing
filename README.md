OpenUI5 Generic App Testing
---------------------------

*Generic App Testing* is a client-side JavaScript library that uses the
excellent OPA (One Page Acceptance) and Gherkin support already provided by
[OpenUI5](https://github.com/SAP/openui5) to allow UI5 app developers to write
entire test scenarios in English language - without coding!

Already today, UI5 developers can use Gherkin to describe test scenarios as a
sequence of steps in the [GWT](https://en.wikipedia.org/wiki/Given-When-Then)
(Given/When/Then) format. Afterwards, the developer must write a set of regular
expressions to parse each step and execute corresponding OPA code that
eventually runs the test.

However, with the *Generic App Testing* library this second part can be
skipped: the developer describes test scenarios with more structured
sentences that are already parsed by an existing set of regular expressions.

For example for the sentence:

```
I click on btnCount 3 times
```

The *Generic App Testing* library already provides a regular expression that
can parse:

```
I click on <id> <n> times
```

Therefore there is no need to write one - and corresponding OPA code.

This project provides many of these generic building blocks. You can browse
them all and even propose new ones directly via the [contribution
tool](https://sap.github.io/openui5-generic-app-testing).

As an aside, knowledge about OPA and Gherkin is not strictly necessary to have
in order to consume this project, but it's definitely useful to have - since
this project builds on these two technologies. A gentle way to be introduced to
these base technologies can be found in this
[UI5ers Buzz blog post](https://blogs.sap.com/2017/05/11/ui5ers-buzz-06-using-opa5-with-gherkin/).

## Requirements

This project requires OPA5 and Gherkin dependencies shipped with
[OpenUI5](https://github.com/SAP/openui5) within the `sap.ui.test` namespaces.

## Download and Installation

A prerequisite to consume the project is having a setup where Gherkin and OPA
tests can run. To fulfil the prerequisite you could structure your code as
suggested in [this example](https://openui5nightly.hana.ondemand.com/#/sample/sap.ui.core.sample.gherkin.GherkinWithQUnit/preview)
from the OpenUI5 SDK Demo Kit, or just mimic the structure of the `test/ui5app`
directory located in this project root directory.

Once the pre-requisite is fulfilled, you should:

1. Clone or download this project

2. Copy all the files from `dist/` into a directory within your project. For example,
   if you are using the `test/ui5app` as the starting directory for your project,
   you could drop these files in `test/ui5app/genericSteps` directory.

3. Assign a namespace for the GenericSteps dependency. You can do
   this by tweaking the `data-sap-ui-resourceroots` script property in the html
   page used to start your OPA tests. This is done in
   `test/ui5app/opaTests.qunit.html` in the sample setup that comes with this
   project.

4. Import GenericSteps into your project and call the `register` method as done
   in `test/ui5app/OpaTestSteps.js`.

5. load .feature files via the opa5 test harness like:

    ```
    opa5TestHarness.test({
        featurePath: "ui5app/test/specs/Test",
        steps: Steps,
        generateMissingSteps: true
    });
    ```

   This is shown in `test/ui5app/opaTests.qunit.html`.

## Known Issues

No known issue at the moment.

## How to obtain support

Please use the GitHub bug tracking system to ask questions or report bugs.

## Contributing

You are welcome to contribute to this project with more generic steps that
allow other types of situations to be tested. All it takes is some JavaScript
regular expressions and OPA5 skills.

The essential part to understand before contributing is that a generic step is
represented as a self-contained unit with the following skeleton:

```javascript
module.exports = {
    docs: {
        description: "",    // what is your step doing?
        synopsis: "",       // what syntax one should use to run this step?
        examples: [         // how does the step look like in real life?
        ]
    },
    icon: "",               // the best sap-icon that represents this action
    regexp: new RegExp("..."),  // Capture English via regular expressions...
    action: function (sCapturedBlock) {  // ... and translate it into OPA5!
        /*
         * Dependencies are injected into the context. Check
         * src/GenericSteps.js to find out what is available via 'this'.
         */
        this.opa.waitFor({
            // your OPA goes here!
        });
    }
};
```

You can browse .js files in `src/steps` to get an idea of how existing steps
look like.

At this point you can decide how to submit your contribution, and you can do so
via a pull request or via a web tool that guides contributors via a GUI.

### Contribute via pull request

The steps below explain a typical development lifecycle. Before starting,
however, you as the developer must fulfil the following pre-requisites:

- repository was forked on GitHub and cloned
- all the required dependencies are installed via `npn install`
- the `grunt` command succeeds
- `npm test` shows all tests are passing

Now you can up your favourite code editor and proceed as follows:

1. Create a new step with the skeleton above and place it under `src/steps/`.
    NOTE: please do not include any other dependency. If you need an OPA5
    action (e.g., EnterText), please inject it in the generic step context by
    editing `src/GenericSteps.js`.

2. Add the newly created step to src/steps/index.js 
    This will allow your step to be validated automatically and registered by
    the consumer of this library.

3. On the terminal, type `npm test` to run basic validation of your step 
    Validation triggers the tests in `test/steps.js`, and includes
    checking that all the examples validate against the given regexp, documentation
    follows the skeleton above... and runs unit tests too!

4. If you want to unit test your generic step, you can do so by placing a unit
   test under `test/steps/`. Use `npm test` to run the unit tests.

5. Once you are ready to use and distribute your new generic action, type
   `grunt` to update the `dist/` folder with new code

6. You are welcome to expand the mini test app of this project with a test for
   your new generic step.
    * Edit `./test/ui5app/ui5app.html` and add new UI5 controls and logic to
      the sample app if necessary.
      To run the sample app, prepare a static file server in the project root
      directory (e.g., `python -m SimpleHTTPServer` if you have Python
      installed). Then navigate to this URL using your web browser:
      `http://localhost:<PORT>/test/ui5app/ui5app.html`.

    * Expand `./test/specs/Test.feature` with a new Gherkin spec that uses your
      action.
      To run OPA tests, prepare a static file server in the project root
      directory. Then run the OPA tests by opening the following URL in the
      browser: `http://localhost:<PORT>/test/ui5app/opaTests.qunit.html` .

### Contribute via web tool

Feel free to send your generic step directly via the contribution tool at:

[https://sap.github.io/openui5-generic-app-testing](https://sap.github.io/openui5-generic-app-testing)

This requires your GitHub credentials which we will not store, but use from
your browser to:

1. create a GitHub Gist containing your suggestion
2. create a new GitHub issue with a link to the gist

## Limitations

Being based on OPA, this library is affected by its same limitations:

- Support for screen capturing
- Testing across more than one page
- Remote test execution
- End-to-end tests are not recommended with OPA due to authentication issues
  and fragility of test data

## To-Do (upcoming changes)

- pretty confirmation dialog when submitting a proposal via the contribution tool.

## License

Copyright (c) 2017 SAP SE. All rights reserved.  This file is licensed under
the Apache Software License 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
