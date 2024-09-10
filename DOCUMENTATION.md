# Karmayogi

#### Branch Naming Rules

- **Excluded Branches**: `main`, `development`, `deployment`

#### Folder Structure

```
/
├── buildmail
├── channels
├── karmayogi
└── services
```

---



# Buildmail 

  #### Folder Structure
  
  ```
  \
  ├── Dockerfile
  ├── index.html
  ├── nginx.conf
  ├── package.json
  ├── src
  ├── tsconfig.json
  └── vite.config.ts

  ```
  #### Info

    - Uses ReactJS
    - Uses S3 (Aws SDK) for storing and updating email templates 
    
  #### Setup
    1. cd /buildmail
    2. pnpm install OR npm install OR yarn install
    3. pnpm run dev

  #### Building container


# Karmayogi 

  #### Folder Structure
  
  ```
  \
  ├── components.json
  ├── compose.ext.yaml
  ├── Dockerfile
  ├── docker.sh
  ├── package.json
  ├── prisma
  ├── public
  └── src
        ├── app
              ├── api
              ├── ((auth))   [Doesn't needs token] (This is nextjs route groups)
              ├── favicon.ico
              ├── globals.css
              ├── layout.tsx
              ├── ((main)) [Needs token]
              └── page.tsx
        ├── components
        ├── database
        ├── forms
        ├── hooks
        ├── lib
        ├── services
        └── states

  ```
  #### Info

    - Uses NextJS App router
    - Uses Prisma
    - Uses shadcn-ui library 
    
  #### Setup Development
    1. cd /karmayogi
    2. docker compose -f compose.ext.yaml up
    3. pnpm run dev

  #### Building container

# Channels 

  #### Folder Structure
  
  ```
  \
  ├── compose.yaml
  ├── package.json
  ├── src
        ├── config
        ├── config.ts
        ├── controllers
        ├── models
        ├── routes
        └── server.ts
  └── tsconfig.json

  ```
  #### Info

    - Uses ExpressJS app
    - Uses Mongoose and MongoDB
    
  #### Setup Development
    1. cd /channels
    2. docker compose up
    3. Set up your .env.dev by copying .env and renaming it
    4. pnpm run server:dev

  #### Building container


# Services 

  #### Folder Structure
  
  ```
  \
  ├── compose.yaml
  ├── package.json
  ├── prisma
  ├── src
        ├── config.ts
        ├── routes
        ├── server.ts
        ├── utils
        └── workers 
  ├── tests
  └── tsconfig.json

  ```
  #### Info

    - Uses ExpressJS app
    - Uses Postgres and prisma 
    
  #### Setup Development
    1. cd /services
    2. docker compose up
    3. Set up your .env.dev by copying .env and renaming it
    4. pnpm run server:dev

  #### Building container




# PORTS

- Karmayogi (NextJS) : **3000**
- Buildmail (ReactJS) : **3001**
- Services (ExpressJS) : **3010**
- Channels (ExpressJS) : **3011**

