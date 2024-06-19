ddn project subgraph create analytics
ddn project subgraph create sales
ddn project subgraph create experience
ddn project subgraph create users

## deploy connectors from sales subgraph
ddn connector build create --connector sales/connector/pg/connector.cloud.yaml --target-supergraph supergraph.cloud.yaml --target-connector-link pg
ddn connector build create --connector sales/connector/ts/connector.cloud.yaml --target-supergraph supergraph.cloud.yaml --target-connector-link ts --log-level DEBUG
