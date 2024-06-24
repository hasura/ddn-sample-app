# Ecommerce App Demo using DDN (beta)

This demo provides a practical example of building an Ecommerce App using Hasura's Data Delivery Network (DDN) with a [supergraph](https://supergraph.io) architecture.

## Instructions

- [Install Hasura CLI](https://hasura.io/docs/3.0/cli/installation)
- [Install Docker](https://docs.docker.com/engine/install/)


### local development

1. Start the engine and connector services

```shell
HASURA_DDN_PAT=$(ddn auth print-pat) docker compose -f docker-compose.hasura.yaml watch
```

> Note: For local development, Hasura runs several services (engine, connectors, auth, etc.), which use the following ports: 3000, 4317, 4318, 8081, 8082, 8083, 8084, and 8085. Please ensure these ports are available. If not, modify the published ports in the Docker Compose files from this repository accordingly.


2. start the TS function runtime

Open a new terminal (the previous script needs to be running to continou further) and execute the following

```shell
cd sales/connector/ts && npm i
npx dotenv -e .env.local -- npm run watch
```

3. To rebuild any changes

```shell
ddn supergraph build local --output-dir ./engine
```

- Open console with this URL https://console.hasura.io/local/graphql?url=http://localhost:3000 and test using GraphQL API queries from the [Composability folder](https://github.com/hasura/ddn_beta_ecommerce/tree/main/Composability).
  - For [AuthZ](https://github.com/hasura/ddn_beta_ecommerce/blob/main/Composability/authZ.graphQL): Set x-hasura-role = customer and x-hasura-user-id = some_user_id and run the AuthZ query

This example supergraph is composed of four subgraphs - users, analytics, experience, and sales, each backed by one or more data connectors. These subgraphs integrate various data sources to provide a comprehensive Ecommerce solution as follows.


### Deploy to DDN Cloud

- [Create Project](https://hasura.io/docs/3.0/getting-started/deployment/create-a-project) 

```sh
ddn project create

# 5:34PM INF Project "vast-buzzard-0000" created on Hasura DDN successfully
# +-------------+-----------------------------------------------------+
# | Name        | vast-buzzard-0000                                   |
# +-------------+-----------------------------------------------------+
# | Console URL | https://console.hasura.io/project/vast-buzzard-0000 |
# +-------------+-----------------------------------------------------+
```

This will create a new project and shows the project name output in the terminal
- Setup  Project Name and change it on [.hasura/context.yaml](.hasura/context.yaml) . Cloning the repo will generate all confgiration files you need. All you need to change is the project name.
```sh
ddn context set project <Project Name>

# ddn context set project vast-buzzard-0000
# 5:36PM INF Key "project" set to "vast-buzzard-0000" in the context successfully
```

- Execute the following commands to set up your subgraphs (copy paste them and run them one by one as it is)

```sh
ddn project subgraph create analytics
ddn project subgraph create sales
ddn project subgraph create experience
ddn project subgraph create users
```
#### Deploy each connectors 

```shell

## deploy connectors from analytics subgraph
ddn connector build create --connector analytics/connector/clickhouse/connector.cloud.yaml --target-supergraph supergraph.cloud.yaml --target-connector-link clickhouse

## deploy connectors from experience subgraph
ddn connector build create --connector experience/connector/pg/connector.cloud.yaml --target-supergraph supergraph.cloud.yaml --target-connector-link pg
ddn connector build create --connector experience/connector/mongo/connector.cloud.yaml --target-supergraph supergraph.cloud.yaml --target-connector-link mongo

## deploy connectors from sales subgraph
ddn connector build create --connector sales/connector/pg/connector.cloud.yaml --target-supergraph supergraph.cloud.yaml --target-connector-link pg
ddn connector build create --connector sales/connector/ts/connector.cloud.yaml --target-supergraph supergraph.cloud.yaml --target-connector-link ts --log-level DEBUG

## deploy connectors from users subgraph
ddn connector build create --connector users/connector/user_pg/connector.cloud.yaml --target-supergraph supergraph.cloud.yaml --target-connector-link user_pg
```

## Deploy supergraph
```shell
ddn supergraph build create --supergraph supergraph.cloud.yaml
```

> Note: Once deployed to your new project, if you don't have any connector changes, you can only rebuild supergraph alone, ie. connectors are only need to be deployed when there is change (data schema changes, functions etc.)


- go to console and test using GraphQL API queries from the [Composability folder](https://github.com/hasura/ddn_beta_ecommerce/tree/main/Composability).
  - For [AuthZ](https://github.com/hasura/ddn_beta_ecommerce/blob/main/Composability/authZ.graphQL): Set x-hasura-role = customer and x-hasura-user-id = some_user_id and run the AuthZ query

This example supergraph is composed of four subgraphs - users, analytics, experience, and sales, each backed by one or more data connectors. These subgraphs integrate various data sources to provide a comprehensive Ecommerce solution as follows.

![alt text](supergraph-1.png)

### Subgraphs and Data Sources

- **Subgraph: users**
  - _Data Connector: postgres_
    - _Models_: Users, Notifications, Reviews
- **Subgraph: experience**
  - _Data Connector: postgres_
    - _Models_: Cart, CartItems, Categories, Manufacturers, Products, ProductVectorDistance
  - _Data Connector: mongoDB_
    - _Models_: ProductDetails
- **Subgraph: sales**

  - _Data Connector: postgres_
    - _Models_: Coupons, Orders
  - _Typescript Functions_
    - _Commands_: ToCurrencyString, ToDateString

- **Subgraph: analytics**
  - _Data Connector: clickhouse_
    - _Models_: BrowsingHistory, RecentlyViewedProducts, SessionHistory

![alt text](supergraph-2.png)

## Disclaimer

This repository has credentials for databases, which are intentionally published by Hasura for demo purposes. These credentials allows for read-only access to synthetic datasets, which do not contain any user or customer sensitive data.

# Core Concepts

The following section outlines the core concepts of Hasura DDN, providing a deeper understanding of its architecture and functionality.

## Subgraph

For a multi-team organization working on a Hasura project, it can make sense for any one team to not have access to all metadata objects. Subgraphs introduces the notion of a module system for your Hasura metadata. Think of it is as an independent domain consisting of one or more data sources.
[Read More](https://hasura.io/docs/3.0/project-configuration/subgraphs/)

## Models

Models are the link between your data connectors and the API Hasura generates. A model may be backed by a database table, an ad-hoc SQL query, a pre-materialized view, a custom REST or GraphQL API server, etc.
[Read More](https://hasura.io/docs/3.0/supergraph-modeling/models/)

## Commands

Commands are backed by functions or procedures declared in a DataConnectorLink allowing you to execute business logic directly from your GraphQL API. You can use them to validate, process or enrich data, call another API, or even log a user in.

[Read More](https://hasura.io/docs/3.0/supergraph-modeling/commands)

## Build Process

A build is a fully-functional, immutable supergraph API which is built based on your project's configuration.

During the build process, Hasura builds and deploys all the data connectors and supergraph builds. This includes connector configurations, models, functions, and all other related components, which are integrated into the deployments.

Considering the size of the supergraph and separate deployments, it may initially take some time to complete. Once deployed, the supergraph provides a unified GraphQL API that leverages the capabilities of all subgraphs to offer a comprehensive Ecommerce solution.
