SELECT 
    COUNT(*) as viewed,
    product_id,
    user_id,
    groupArray(viewed_at) as viewed_at
FROM browsing_history
GROUP BY product_id, user_id;