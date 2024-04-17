SELECT
  coalesce(json_agg(row_to_json("%11_universe")), '[]') AS "universe"
FROM
  (
    SELECT
      *
    FROM
      (
        SELECT
          coalesce(json_agg(row_to_json("%12_rows")), '[]') AS "rows"
        FROM
          (
            SELECT
              "%1_RELATIONSHIP_categories"."categories" AS "categories",
              "%0_products"."image" AS "image",
              "%0_products"."id" AS "id",
              "%0_products"."price" AS "price",
              "%2_RELATIONSHIP_manufacturers"."manufacturers" AS "manufacturers"
            FROM
              "public"."products" AS "%0_products"
              LEFT OUTER JOIN LATERAL (
                SELECT
                  "%3_ORDER_PART_manufacturers"."name" AS "name"
                FROM
                  (
                    SELECT
                      "%3_ORDER_PART_manufacturers"."name" AS "name"
                    FROM
                      "public"."manufacturers" AS "%3_ORDER_PART_manufacturers"
                    WHERE
                      (
                        "%0_products"."manufacturer_id" = "%3_ORDER_PART_manufacturers"."id"
                      )
                  ) AS "%3_ORDER_PART_manufacturers"
              ) AS "%4_ORDER_FOR_products" ON ('true')
              LEFT OUTER JOIN LATERAL (
                SELECT
                  row_to_json("%1_RELATIONSHIP_categories") AS "categories"
                FROM
                  (
                    SELECT
                      *
                    FROM
                      (
                        SELECT
                          coalesce(json_agg(row_to_json("%6_rows")), '[]') AS "rows"
                        FROM
                          (
                            SELECT
                              "%5_categories"."name" AS "name",
                              "%5_categories"."id" AS "id"
                            FROM
                              "public"."categories" AS "%5_categories"
                            WHERE
                              (
                                "%0_products"."category_id" = "%5_categories"."id"
                              )
                          ) AS "%6_rows"
                      ) AS "%6_rows"
                  ) AS "%1_RELATIONSHIP_categories"
              ) AS "%1_RELATIONSHIP_categories" ON ('true')
              LEFT OUTER JOIN LATERAL (
                SELECT
                  row_to_json("%2_RELATIONSHIP_manufacturers") AS "manufacturers"
                FROM
                  (
                    SELECT
                      *
                    FROM
                      (
                        SELECT
                          coalesce(json_agg(row_to_json("%9_rows")), '[]') AS "rows"
                        FROM
                          (
                            SELECT
                              "%8_manufacturers"."name" AS "name"
                            FROM
                              "public"."manufacturers" AS "%8_manufacturers"
                            WHERE
                              (
                                "%0_products"."manufacturer_id" = "%8_manufacturers"."id"
                              )
                          ) AS "%9_rows"
                      ) AS "%9_rows"
                  ) AS "%2_RELATIONSHIP_manufacturers"
              ) AS "%2_RELATIONSHIP_manufacturers" ON ('true')
            ORDER BY
              "%4_ORDER_FOR_products"."name" DESC
            LIMIT
              10
          ) AS "%12_rows"
      ) AS "%12_rows"
  ) AS "%11_universe"