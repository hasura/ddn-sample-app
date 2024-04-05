# Ecommerce App Demo using DDN (beta)

![Alt text](https://github.com/hasura/ddn_beta_ecommerce/blob/main/ecommappschema.png)

## Instructions

- Install Hasura CLI
- Login to Hasura CLI
- Create Project
- Copy Project Name
- Create New Folder
- Git Clone Repo
- Go to Hasua.yaml and replace the project name with the one above
- run ddn build supergraph-manifest
- go to console and test using queries in complex.graphQL
- For AuthZ
  - Set x-hasura-role = customer and x-hasura-user-id = some_user_id and run the AuthZ query
