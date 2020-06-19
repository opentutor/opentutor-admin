# opentutor-grading-client
web ui for grading opentutor sessions


Usage
-----

A docker image that serves a web client for question/answer sessions using prerecorded mentor videos and an AI classifier provided by [mentor-api](https://github.com/ICTLearningSciences/mentor-api)


Variables
---------

In order to function properly the client generally requires these environment variables defined:

- **CMI5_ENDPOINT**: The cmi5 xapi [endpoint](https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#81-launch-method) to use for guest sessions, e.g. https://mentorpal.org/lrs/xapi

- **CMI5_FETCH**: The cmi5 [fetch](https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#81-launch-method) url used to retrieve an auth token for guest sessions, e.g. https://mentorpal.org/lrs/auth/guesttoken

- **MENTOR_API_URL**: The base url for the the [mentor-api](https://github.com/ICTLearningSciences/mentor-api), e.g. https://mentorpal.org/mentor-api

- **MENTOR_VIDEO_URL**: The base url for the mentor videos, e.g. https://video.mentorpal.org/videos


Development
-----------

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

#### Cypress Testing

To run cypress tests locally you need two shells, first make sure the client is running locally:

```
cd client && make develop
```

...then you can run the full cypress test suite with

```
cd client && make test-cypress
```

The standard `.only` suffix in the test spec files doesn't seem to work, so if you want to run a single test, launch the cypress client instead

```
cd client && npm run cy:open
```

...then in the cypress browser window, click a spec to run it.


Releases
--------

Currently, this image is semantically versioned. When making changes that you want to test in another project, create a branch and PR and then you can release a test tag one of two ways:

To build/push a work-in-progress tag of `mentor-client` for the current commit in your branch

- find the `docker_tag_commit` workflow for your commit in [circleci](https://circleci.com/gh/ICTLearningSciences/workflows/mentor-client)
- approve the workflow
- this will create a tag like `https://hub.docker.com/mentor-client:${COMMIT_SHA}`

To build/push a pre-release semver tag of `mentor-client` for the current commit in your branch

- create a [github release](https://github.com/ICTLearningSciences/mentor-client/releases/new) **from your development branch** with tag format `/^\d+\.\d+\.\d+(-[a-z\d\-.]+)?$/` (e.g. `1.0.0-alpha.1`)
- find the `docker_tag_release` workflow for your git tag in [circleci](https://circleci.com/gh/ICTLearningSciences/workflows/mentor-client)
- approve the workflow
- this will create a tag like `uscictdocker/mentor-client:1.0.0-alpha.1`



Once your changes are approved and merged to master, you should create a release tag in semver format as follows:

- create a [github release](https://github.com/ICTLearningSciences/mentor-client/releases/new) **from master** with tag format `/^\d+\.\d+\.\d$/` (e.g. `1.0.0`)
- find the `docker_tag_release` workflow for your git tag in [circleci](https://circleci.com/gh/ICTLearningSciences/workflows/mentor-client)
- approve the workflow
- this will create a tag like `uscictdocker/mentor-client:1.0.0`
