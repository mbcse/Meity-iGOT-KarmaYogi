# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [pre-dev-0.0.1] - 2024-07-06

### Added

- Create Changelog.md and Documentation.md
- Init /karmyogi (nextJS app) 
- Added ShadCN to /karmayogi
- Initialized prisma in /karmayogi
- Added Button from shadcn ui
- Added Storybook to /karmayogi
- Configured storybook for dark theme 
- Added next-themes for /karmayogi
- Init /services (Microservices folder)
- /services
    /caches
    /producers
    /utils
    /workers
    ...(rest of files)
- /services : uses ts-node-dev
  
## [pre-dev-0.0.2] - 2024-07-06

### Added

- Added test cases for /services
- Added infra for temp docker based auxillary services for testing . It will spin up container , perform tests , and take containers down after it .
- the above thing is done with newly added compose.yaml and compose.test.sh
- Added e2e testing for NextJS /karmayogi with help of custom docker image to support any type of OS
- Added Prisma in services
- Added the following test cases for /services

    ```
    /services 
        /tests
            | auth.test.js
            | health.test.js
            | producer.test.js
    ```

- Added concurrently for executing /services script
- Added xdescribe to TODO folder for tests .