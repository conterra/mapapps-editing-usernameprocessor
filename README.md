# mapapps-editing-usernameprocessor

This bundle registers an EditorInterceptor that provides the current username to the editing bundle.

## Sample App
https://demos.conterra.de/mapapps/resources/apps/public_demo_editingusernameprocessor/index.html

## Installation Guide

**Requirements:**

- map.apps 4.9.0 or later

Simply add the bundle "dn_editingusernameprocessor" to your app.

[dn_editingusernameprocessor Documentation](https://github.com/conterra/mapapps-editing-usernameprocessor/tree/master/src/main/js/bundles/dn_editingusernameprocessor)

## Quick start

Clone this project and ensure that you have all required dependencies installed correctly (see [Documentation](https://docs.conterra.de/en/mapapps/latest/developersguide/getting-started/set-up-development-environment.html)).

Then run the following commands from the project root directory to start a local development server:

```bash
# install all required node modules
$ mvn initialize

# start dev server
$ mvn compile -Denv=dev -Pinclude-mapapps-deps

# run unit tests
$ mvn test -P run-js-tests,include-mapapps-deps
```
