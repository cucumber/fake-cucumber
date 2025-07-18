# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [18.1.0] - 2025-07-19
### Added
- Populate `Exception.stackTrace` on messages ([#147](https://github.com/cucumber/fake-cucumber/pull/147))

## [18.0.0] - 2024-11-08
### Added
- Populate `TestRunStarted.id`, `TestCase.testRunStartedId` and `TestRunFinished.testRunStartedId` on messages
- Populate `Hook.type` on messages

### Changed
- Changed signatures of `makeTestCase` and `makeTestPlan`

## [17.0.0] - 2024-08-29
### Removed
- BREAKING CHANGE: Remove synthetic step for empty pickles ([#125](https://github.com/cucumber/fake-cucumber/pull/125))

## [16.5.0] - 2024-08-01
### Added
- Add support for link attachments ([#121](https://github.com/cucumber/fake-cucumber/pull/121))

## [16.4.0] - 2023-11-10
### Added
- Include `message` prop in result for pending steps ([#106](https://github.com/cucumber/fake-cucumber/pull/106))

## [16.3.0] - 2023-07-03
### Added
- Support including `fileName` in attachment ([#92](https://github.com/cucumber/fake-cucumber/pull/92))

## [16.2.0] - 2023-05-13
### Added
- Upgrade to `@cucumber/messages` `21`
- Add `sourceReference` to `parameterType` ([#90](https://github.com/cucumber/fake-cucumber/pull/90))

## [16.1.0] - 2022-12-17
### Added
- Exception to step result ([#78](https://github.com/cucumber/fake-cucumber/pull/78))
- Upgrade to `@cucumber/messages` `21`
- Upgrade to `@cucumber/gherkin` `26`

## [16.0.0] - 2022-06-01
### Added
- Ability to provide a name for `Before` and `After` hooks ([#1914](https://github.com/cucumber/common/pull/1914))

### Changed
- Replace former `@cucumber/create-meta` with newer `@cucumber/ci-environment`
- Update cucumber dependencies to bring support for retaining step keywords (refs. https://github.com/cucumber/common/pull/1741)

## [15.0.0] - 2021-10-01
### Changed
- Pending results are now properly failing the execution
([PR#1751](https://github.com/cucumber/common/pull/1751))

## [14.0.0] - 2021-09-02
### Changed
- Upgrade to `@cucumber/messages` `17.1.0`
- Upgrade to `@cucumber/gherkin` `21.0.0`

## [13.0.0] - 2021-07-08
### Added
- Add support for retrying failed scenarios via `--retry <COUNT>` option ([#1631](https://github.com/cucumber/common/pull/1631))

### Changed
- Upgrade dependencies including `@cucumber/gherkin` v20.0 and `@cucumber/messages` v17.0

## [12.0.2] - 2021-05-18
### Fixed
- `UNDEFINED` steps are always reported as `UNDEFINED`. They used to be reported as `SKIPPED`
if the previous step was not `PASSED`.

## [12.0.1] - 2021-05-17
### Changed
- Upgrade to `@cucumber/message-streams` `2.0.0`

## [12.0.0] - 2021-05-17
### Changed
- Upgrade messages to 16.0.0

### Fixed
- The `TestRunFinished` message now has `success` set to `false` if there was a step with
status `AMBIGUOUS`, `FAILED` or `UNDEFINED`.
- After hooks are executed in reverse order of definition.

## [11.0.0] - 2021-03-29
### Changed
- Upgrade to gherkin 18.0.0
- Upgrade to messages 15.0.0

## [10.0.0] - 2021-02-07
### Changed
- Upgrade to gherkin 17.0.0
- Upgrade to messages 14.0.0

### Fixed
- [JavaScript] removed circular dependencies.
([#1292](https://github.com/cucumber/cucumber/pull/1292)
[davidjgoss](https://github.com/aslakhellesoy))

## [9.0.0] - 2020-11-04
### Changed
- Upgrade internal dependencies

## [8.0.0] - 2020-08-07
### Added
- Export `IClock`, `DateClock`, `IStopwatch` and `PerfHooksStopwatch`

### Changed
- Update `messages` to 13.0.1
- The public API now uses a new `IStopwatch` interface in some method signatures.
([#1131](https://github.com/cucumber/cucumber/pull/1131)
[aslakhellesoy](https://github.com/aslakhellesoy))
- The `IClock#now()` signature changed to `IClock#clockNow()`

## [7.1.0] - 2020-06-29
### Added
- The first emitted message is a `Meta` message.
([#976](https://github.com/cucumber/cucumber/pull/976)
[aslakhellesoy](https://github.com/aslakhellesoy))

## [7.0.0] - 2020-04-14
### Added
- expose `withFullStackTrace` and `withSourceFramesOnlyStackTrace`
- expose internals needed to generate test cases and allow specifying a custom function to compute test cases
- expose `IHook`, added `SupportCode.registerBeforeDefinition` and `SupportCode.registerAfterDefinition` to enable custom Hook execution
- expose `IWorld`
- expose `IStepDefinition` and added `SupportCode.registerStepDefinition` to enable custom step matching

### Changed
- Upgrade to messages 12.0.0
- Upgrade to gherkin 13.0.0

### Removed
- Removed the `--globals` option
- Removed `IStepDefinition#getArguments(string)` - doesn't need to be on interface.
This removes an API dependency on `@cucumber/cucumber-expressions`

## [6.0.0] - 2020-03-31
### Changed
- Upgrade to messages 11.x
- [JavaScript] All array return values and function parameters are now declared as TypeScript `ReadOnlyArray`

## [5.0.0] - 2020-03-02
### Changed
- Upgraded messages and gherkin

## [4.0.0] - 2020-02-14
### Changed
- Upgraded cucumber-expressions, gherkin and messages

## [3.0.3] - 2020-01-10
### Changed
- [JavaScript] changed module name to `@cucumber/fake-cucumber`

## [3.0.2] - 2019-12-10
### Fixed
- Add `typescript` to runtime dependencies

## [3.0.1] - 2019-12-10
### Fixed
- Add `ts-node` to runtime dependencies

## [3.0.0] - 2019-12-10
### Added
- Implement `Given`/`When`/`Then`/`After`/`Before` DSL
- Dynamically load files from the file system
- Support Hooks
([#803](https://github.com/cucumber/cucumber/pull/803)
[vincent-psarga](https://github.com/aslakhellesoy))

### Changed
- Upgrade to `gherkin` `9.0.0`
- Upgrade to `cucumber-messages` `8.0.0`
- Upgrade to `cucumber-expressions` `8.3.0`

### Fixed
- Test results are now realistic - using duration and error messages from step definitions.
([#801](https://github.com/cucumber/cucumber/pull/801)
[vincent-psarga](https://github.com/aslakhellesoy))

### Removed
- Remove `--format json`. Only support `--format ndjson|protobuf`

## [2.1.0] - 2019-11-14
### Changed
- Upgrade to gherkin 8.2.0
- Upgrade to cucumber-messages 7.0.0

## [2.0.3] - 2019-10-22
### Fixed
- Try another build of the docker image

## [2.0.2] - 2019-10-22
### Changed
- Document how to run via docker

## [2.0.1] - 2019-10-21
### Fixed
- Add source map support for better stack traces

## [2.0.0] - 2019-10-04
### Changed
- Generate TestStepFinished messages with duration instead of durationNanoseconds
- Upgrade cucumber-messages to 6.0.1
- Upgrade gherkin to 8.0.0

## [1.1.1] - 2019-09-04
### Fixed
- More realistic random results

## [1.1.0] - 2019-08-29
### Changed
- Upgrade to Gherkin 7.0.4

### Fixed

## [1.0.1] - 2019-08-29
### Added
- Add new --results=none|random|pattern option

## [1.0.0] - 2019-08-23
### Added
- First release

[Unreleased]: https://github.com/cucumber/fake-cucumber/compare/v18.1.0...HEAD
[18.1.0]: https://github.com/cucumber/fake-cucumber/compare/v18.0.0...v18.1.0
[18.0.0]: https://github.com/cucumber/fake-cucumber/compare/v17.0.0...v18.0.0
[17.0.0]: https://github.com/cucumber/fake-cucumber/compare/v16.5.0...v17.0.0
[16.5.0]: https://github.com/cucumber/fake-cucumber/compare/v16.4.0...v16.5.0
[16.4.0]: https://github.com/cucumber/fake-cucumber/compare/v16.3.0...v16.4.0
[16.3.0]: https://github.com/cucumber/fake-cucumber/compare/v16.2.0...v16.3.0
[16.2.0]: https://github.com/cucumber/fake-cucumber/compare/v16.1.0...v16.1.0
[16.1.0]: https://github.com/cucumber/fake-cucumber/compare/v16.0.0...v16.1.0
[16.0.0]: https://github.com/cucumber/fake-cucumber/compare/v15.0.0...v16.0.0
[15.0.0]: https://github.com/cucumber/fake-cucumber/compare/v14.0.0...v15.0.0
[14.0.0]: https://github.com/cucumber/fake-cucumber/compare/v13.0.0...v14.0.0
[13.0.0]: https://github.com/cucumber/fake-cucumber/compare/v12.0.2...v13.0.0
[12.0.2]: https://github.com/cucumber/fake-cucumber/compare/v12.0.1...v12.0.2
[12.0.1]: https://github.com/cucumber/fake-cucumber/compare/v12.0.0...v12.0.1
[12.0.0]: https://github.com/cucumber/fake-cucumber/compare/v11.0.0...v12.0.0
[11.0.0]: https://github.com/cucumber/fake-cucumber/compare/v10.0.0...v11.0.0
[10.0.0]: https://github.com/cucumber/fake-cucumber/compare/v9.0.0...v10.0.0
[9.0.0]: https://github.com/cucumber/fake-cucumber/compare/v8.0.0...v9.0.0
[8.0.0]: https://github.com/cucumber/fake-cucumber/compare/v7.1.0...v8.0.0
[7.1.0]: https://github.com/cucumber/fake-cucumber/compare/v7.0.0...v7.1.0
[7.0.0]: https://github.com/cucumber/fake-cucumber/compare/v6.0.0...v7.0.0
[6.0.0]: https://github.com/cucumber/fake-cucumber/compare/v5.0.0...v6.0.0
[5.0.0]: https://github.com/cucumber/fake-cucumber/compare/v4.0.0...v5.0.0
[4.0.0]: https://github.com/cucumber/fake-cucumber/compare/v3.0.3...v4.0.0
[3.0.3]: https://github.com/cucumber/fake-cucumber/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/cucumber/fake-cucumber/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/cucumber/fake-cucumber/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/cucumber/fake-cucumber/compare/v2.1.0...v3.0.0
[2.1.0]: https://github.com/cucumber/fake-cucumber/compare/v2.0.3...v2.1.0
[2.0.3]: https://github.com/cucumber/fake-cucumber/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/cucumber/fake-cucumber/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/cucumber/fake-cucumber/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/cucumber/fake-cucumber/compare/v1.1.1...v2.0.0
[1.1.1]: https://github.com/cucumber/fake-cucumber/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/cucumber/fake-cucumber/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/cucumber/fake-cucumber/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/cucumber/fake-cucumber/releases/tag/v1.0.0
