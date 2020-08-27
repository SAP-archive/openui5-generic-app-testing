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

## Contribute via pull request

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
    editing `src/GenericSteps.js`. Also, have a look at `src/utils.js` for
    functions that can be shared across actions. Like `opa` and `Opa5`, also
    the utils object is injected in the context of a step action: you can
    access utils within an action via `this.utils`

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

### Developer Certificate of Origin (DCO)

Due to legal reasons, contributors will be asked to accept a DCO before they submit the first pull request to this projects, this happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## Contribute via web tool

Feel free to send your generic step directly via the contribution tool at:

[https://sap.github.io/openui5-generic-app-testing](https://sap.github.io/openui5-generic-app-testing)

This requires your GitHub credentials which we will not store, but use from
your browser to:

1. create a GitHub Gist containing your suggestion
2. create a new GitHub issue with a link to the gist
