SELECT 
    COUNT(*) as viewed,
    product_id,
    user_id,
    groupArray(viewed_at) as viewed_at
FROM browsing_history
GROUP BY product_id, user_id;

GROUP BY Clause:

GROUP BY product_id, user_id: 

-- This instruction tells ClickHouse to organize the data into groups
--  based on unique combinations of product_id and user_id. Each group will correspond 
--  to a specific product-user pair, meaning all records for each specific user-product 
--  interaction are aggregated together. This is crucial for calculating the total views 
--  and collating all view timestamps per product per user.

--  groupArray(viewed_at) as viewed_at: groupArray is a ClickHouse-specific aggregate function that collects all the values of 
-- viewed_at into an array for each group. The viewed_at field typically stores timestamps indicating when each viewing occurred.
--  Thus, this part of the query provides a list of all timestamps when a particular user viewed a particular product.