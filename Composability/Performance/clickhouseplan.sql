-- With Native Query
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


  --- With Predicate

  SELECT
  cast(
    tupleElement("_rowset"."_rowset", 1),
    'Array(Tuple("loggedInAt" String, "userId" String))'
  ) AS "rows"
FROM
  (
    SELECT
      tuple(
        groupArray(
          tuple(
            "_row"."_field_loggedInAt",
            "_row"."_field_userId"
          )
        )
      ) AS "_rowset"
    FROM
      (
        SELECT
          "_origin"."logged_in_at" AS "_field_loggedInAt",
          "_origin"."user_id" AS "_field_userId"
        FROM
          "default"."session_history" AS "_origin"
        WHERE
          "_origin"."user_id" = '7cf0a66c-65b7-11ed-b904-fb49f034fbbb'
      ) AS "_row"
  ) AS "_rowset" FORMAT JSON;