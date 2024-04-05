# Ecommerce App Demo using DDN (beta)

![Alt text](https://github.com/hasura/ddn_beta_ecommerce/blob/main/ecommappschema.png)

## Instructions

- [Install Hasura CLI](https://hasura.io/docs/3.0/cli/installation)
- [Login to Hasura CLI](https://hasura.io/docs/3.0/cli/commands/login)
- [Create Project](https://hasura.io/docs/3.0/cli/commands/create-project)
- Copy Project Name. Feel free to delete the project folders/files that were created. Cloning the repo will regenerate all of that for you. All you need is the project name.
- Git Clone [Repo](https://github.com/hasura/ddn_beta_ecommerce.git) and cd into it
- Go to Hasura.yaml and replace the project name with the one you get in the step above
- [run ddn build supergraph-manifest](https://hasura.io/docs/3.0/cli/commands/build-supergraph-manifest)
- go to console and test using queries from complex.graphQL
- For AuthZ
  - Set x-hasura-role = customer and x-hasura-user-id = some_user_id and run the AuthZ query
