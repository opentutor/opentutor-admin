# opentutor-admin
web ui for grading opentutor sessions


## Usage


A docker image that serves a web client for grading opentutor sessions .


## Variables

In order to function properly the client generally requires these environment variables defined:

- **GRAPHQL_ENDPOINT**: The graphql endpoint for accessing grader data. Defaults to /graphql


## Development

### Required Software

- unix system (osx or linux)
- node/npm 12.X
- yarn
- docker

Any changes made to this repo should be covered by tests. To run the existing tests:

```
make test
```

All pushed commits must also pass format and lint checks. To check all required tests before a commit:

```
make test-all
```

To fix formatting issues:

```
make format
```

### Cypress Testing

To run cypress tests locally you need two shells, first make sure the client is running locally:

```
cd client && make develop
```

...then you can run the full cypress test suite with

```
cd client && make test-cypress
```

```
cd client && yarn run cy:open
```

...then in the cypress browser window, click a spec to run it.

### Cypress Visual-Regression Testing

We use [cypress-image-snapshot](https://www.npmjs.com/package/cypress-image-snapshot) for visual-regression testing. 

Generally, you don't want to run the image-snapshot tests while developing because they will fail based on small differences in rendering from environment to environment. For this reason, the default npm commands for `cy:open` and `cy:run` disable image-snapshot testing.

What you *must* do, is update image snapshots before push any changes that change the presentation of the app (at least for screens under visual-regression test).

To update snapshots do:

```
cd client && make cypress-update-snapshots
```

This command updates snapshots, running cypress in the same docker image used for testing in Circleci. It may take a while the first time you run it, because the process needs to install and cache dependencies in a distinct folder (because they will install/compile for the linux flavor in the docker image).

If anything is failing with `make cypress-update-snapshots`, try

```
make clean-cypress-snapshot-cache
```

## Releases

Currently, this image is semantically versioned. When making changes that you want to test in another project, create a branch and PR and then you can release a test tag one of two ways:

To build/push a work-in-progress tag of `opentutor-admin` for the current commit in your branch

- find the `docker_tag_commit` workflow for your commit in [circleci](https://circleci.com/gh/ICTLearningSciences/workflows/opentutor-admin)
- approve the workflow
- this will create a tag like `https://hub.docker.com/opentutor-admin:${COMMIT_SHA}`

To build/push a pre-release semver tag of `opentutor-admin` for the current commit in your branch

- create a [github release](https://github.com/ICTLearningSciences/opentutor-admin/releases/new) **from your development branch** with tag format `/^\d+\.\d+\.\d+(-[a-z\d\-.]+)?$/` (e.g. `1.0.0-alpha.1`)
- find the `docker_tag_release` workflow for your git tag in [circleci](https://circleci.com/gh/ICTLearningSciences/workflows/opentutor-admin)
- approve the workflow
- this will create a tag like `uscictdocker/opentutor-admin:1.0.0-alpha.1`



Once your changes are approved and merged to master, you should create a release tag in semver format as follows:

- create a [github release](https://github.com/ICTLearningSciences/opentutor-admin/releases/new) **from master** with tag format `/^\d+\.\d+\.\d$/` (e.g. `1.0.0`)
- find the `docker_tag_release` workflow for your git tag in [circleci](https://circleci.com/gh/ICTLearningSciences/workflows/opentutor-admin)
- approve the workflow
- this will create a tag like `uscictdocker/opentutor-admin:1.0.0`
