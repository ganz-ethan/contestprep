# Accounts, friends and forum

Until you connect a database the site runs these screens in **demo mode** (data stays in one browser, nothing is shared).
To make accounts, friends and the forum real and shared (free, about 10 minutes):

1. Create a free project at https://supabase.com (any name, any region).
2. **SQL Editor > New query**, paste all of `community/schema.sql`, click **Run**.
3. **Project Settings > API**: copy the **Project URL** and the **anon public** key. The anon key is meant to be public; the security comes from the row-level-security rules in the SQL. Never put the `service_role` key anywhere in this site.
4. Put both in `config.js` under `community: { supabaseUrl: "...", anonKey: "..." }`, bump the `?v=` numbers in `index.html`, commit and push.
5. **Authentication > Providers > Email**: decide whether to require email confirmation (recommended). **Authentication > URL Configuration**: set the Site URL to your site address so confirmation links work.
6. Make yourself a moderator with the one-line `update` at the bottom of `schema.sql`.

## Safety and moderation (read this before opening it to students)

- Users see only a username and, if they choose, their diagnostic level. Email addresses stay in Supabase and are never shown.
- The sign-up form asks users to confirm they are 13 or older (or have a parent or guardian's OK). Children under 13 are covered by laws such as COPPA, and a public forum with accounts is more than the anonymous site was. Check with a school, a parent group or a lawyer before inviting young children. This is not legal advice.
- Posts are plain text: HTML is always escaped and only `$...$` math is rendered. There are no images, links are not clickable, and there are no private messages, to limit abuse.
- Anyone can read the forum without signing in. Signed-in users can post, report, and delete their own posts. Reports go to the `reports` table; moderators (`is_admin`) can delete any post and read reports in the Supabase Table Editor.
- Posting is rate-limited to 5 per minute per person in the database.
- You, as the owner, are responsible for the content. Check reports regularly.
