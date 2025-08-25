## Lọc dữ liệu

Các toán tử thường dùng

- equals ($eq) → bằng
- not equals ($ne)
- greater than ($gt)
- greater than or equal ($gte)
- less than ($lt)
- less than or equal ($lte)
- contains ($contains) → LIKE %value%
- startsWith ($startsWith)
- endsWith ($endsWith)
- in → nằm trong danh sách
- notIn → không nằm trong danh sách

Ví dụ:
GET /api/articles?filters[title][$contains]=strapi
