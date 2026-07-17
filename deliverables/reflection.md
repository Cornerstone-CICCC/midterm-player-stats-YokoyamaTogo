# Reflection

I built a app with Astro, Express, PostgreSQL, and `pg`. It includes a searchable, paginated, sortable performance table; a create, edit, and delete page; and a rankings page with sortable player statistics.

The CSV was normalized into `players`, `matches`, and `performances`. `players` stores player details such as name, team, and position, while `matches` stores the date, stadium, city, and tournament stage. `performances` stores one player's match statistics and references `players(player_id)` and `matches(match_id)` through foreign keys. This reduces duplicate data and makes joins and rankings easier.

The main challenge was connecting the UI to safe database queries. I used parameterized values for user input and fixed allow-lists for sort columns.
