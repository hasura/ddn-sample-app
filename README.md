# Ecommerce App Demo using DDN (beta)

![Alt text](https://github.com/hasura/ddn_beta_ecommerce/blob/main/ecommappschema.png)

## Instructions

- [Install Hasura CLI](https://hasura.io/docs/3.0/cli/installation)
- [Login to Hasura CLI](https://hasura.io/docs/3.0/cli/commands/login)
- [Create Project](https://hasura.io/docs/3.0/cli/commands/create-project)
- Copy Project Name
- Create New Folder (Important)
- Git Clone [Repo](https://github.com/hasura/ddn_beta_ecommerce.git)
- Go to Hasua.yaml and replace the project name with the one above
- [run ddn build supergraph-manifest](https://hasura.io/docs/3.0/cli/commands/build-supergraph-manifest)
- go to console and test using queries in complex.graphQL
- For AuthZ
  - Set x-hasura-role = customer and x-hasura-user-id = some_user_id and run the AuthZ query
