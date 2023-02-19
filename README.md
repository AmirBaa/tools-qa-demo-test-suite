# ToolsQA Demo Site Test Suite

A small test suite of e2e tests done in cypress, for smoke tests for the QA demo page: https://shop.demoqa.com/

## Test Cases

All test cases can be found in the excel sheet file "TestCases.xlsx".

## Bug Reports

While working on the test cases and the automated smoke tests, several bugs have been discovered which are documented in the excel sheet file "BugReports.xlsx".

## How to run the test suite

#### Prerequisites

You need to have node and npm installed on the machine you want to run the tests on.

#### Run test suite

Install the dependencies and devDependencies and start cypress to run the tests:

```sh
npm i
npx cypress open
```
