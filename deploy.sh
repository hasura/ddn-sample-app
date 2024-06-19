# Scripts to deploy the connectors and supergraph

ddn project subgraph create analytics
ddn project subgraph create sales
ddn project subgraph create experience
ddn project subgraph create users

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


## deploy supergraph
ddn supergraph build create --supergraph supergraph.cloud.yaml