EXPLAIN
SELECT
  cast(
    tupleElement("_rowset"."_rowset", 1),
    'Array(Tuple("productId" String, "userId" String, "viewed" Int32, "viewedAt" Array(String)))'
  ) AS "rows"
FROM
  (
    SELECT
      tuple(
        groupArray(
          tuple(
            "_row"."_field_productId",
            "_row"."_field_userId",
            "_row"."_field_viewed",
            "_row"."_field_viewedAt"
          )
        )
      ) AS "_rowset"
    FROM
      (
        SELECT
          "_origin"."product_id" AS "_field_productId",
          "_origin"."user_id" AS "_field_userId",
          "_origin"."viewed" AS "_field_viewed",
          "_origin"."viewed_at" AS "_field_viewedAt"
        FROM
          (
            SELECT
              COUNT(*) as viewed,
              product_id,
              user_id,
              groupArray(viewed_at) as viewed_at
            FROM
              browsing_history
            GROUP BY
              product_id,
              user_id
          ) AS "_origin"
      ) AS "_row"
  ) AS "_rowset" FORMAT JSON;