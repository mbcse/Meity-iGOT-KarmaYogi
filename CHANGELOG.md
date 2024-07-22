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


## [pre-dev-0.0.3] - 2024-07-14

BRANCH : feature/004/redis-setup

### Added

- Added router for producer 
- Added utils for producers 
- Made postman collections for testing producers
- Redis queues works well with producers  


## [pre-dev-0.0.4] - 2024-07-15

BRANCH : feature/005/llmsql

### Added

- Added prisma to karmayogi
- Added @langchain packages
- Added ChatBot API to karmayogi (/buckets)
- Made sure that user query and outputted sql queries are logged for creating a strong dataset
- Table component created 
- DB seeding script written with @fakerjs with en_IN localisation
- Chatbot have programmatic blockers to prevent execution of commands such as UPDATE,DELETE,DROP


## [pre-dev-0.0.5] - 2024-07-16

### Added

- Added api for creating and showing view in /karmayogi nextjs app
- Added saving bucket api in /services
- Prisma schema in /Services , added bucket model


## [pre-dev-0.0.6] - 2024-07-16

### Added

- Added integration to /buckets
- Buckets shows previously saved bucket, creates and saves buckets .

### TODO
- TODO : Finish UI and squash quirky bugs , Make sure SQLTable component can handle both saved buckets and fresh SQLLLM buckets data . They are different in nature and hence SQLComponent is failing to load saved bucket data .
- TODO : Add toast for notifying user that the bucket is saved now
- TODO : Add loading states
- TODO : Refactor thr buckets page in components , one component will have previous buckets , another component can show and interact with LLM bot


## [pre-dev-0.0.7] - 2024-07-21

### Added

- Added Jotai for global state management
- Added mulitple shadcn components
- Created campaigns page
- Create modals for sms,email and whatsapp campaign creation

## Changed

- Changes prisma schema and API to adapt with integration

## TODO
- Create main campaign modal
- Integrate modals with their apis

## [pre-dev-0.0.8] - 2024-07-22

### Added

- Added workers for sms and email
- Email uses nodemailer 
- SMS is a dummy call which will log in .log file
- Email worker has been tested with actual smtp server connection
- caching is used in redis , for making sure that the body that is pulled from FileStorage/s3 doesn't have to be called multiple times (saves api costs)

## TODO

- Make a way to connect filestorage for caching values (Maybe URI)