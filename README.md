OpenUI5 Generic App Testing
---------------------------
[![REUSE status](https://api.reuse.software/badge/github.com/SAP/openui5-generic-app-testing)](https://api.reuse.software/info/github.com/SAP/openui5-generic-app-testing)

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

## Limitations

Being based on OPA, this library is affected by its same limitations:

- Support for screen capturing
- Testing across more than one page
- Remote test execution
- End-to-end tests are not recommended with OPA due to authentication issues
  and fragility of test data
