# Linear task template (Quotes Backend)

Every Linear issue for this repo follows the structure below. **The issue itself is written in
Russian**: the title, the section headings exactly as shown, the body, and the checklist lines. This
file explains each section in English. The `linear-tasks` skill uses it as the source of structure
when creating issues.

Drop empty or irrelevant sections — no placeholders. Sections marked _(optional)_ are added only when
there is something to say.

Issue metadata: project **Quotes**, the milestone matching the area of work (Фундамент, Баги и
безопасность, Рефакторинг, Полировка), state `Todo`, labels `Backend` plus the type (`Feature` /
`Improvement` / `Bug` / `Infra` / `AI`). Use a "blocked by" relation only for a real technical
dependency; otherwise "related".

The title stays short; specifics go into the body.

---

## Порядок _(optional)_

Which issues (`MY-<n>`) this one comes after and why, which run alongside it, and which issues build
on it.

## Зачем

The problem or gap today and what should change. One or two paragraphs, grounded in the code (layer,
function, current behavior), focused on the result a client of the API sees.

## Что сделать

A numbered list of concrete steps:

- which layers and files are touched (route, validator, controller, service, query builder, model,
  seed, Docker);
- the request and response shape, status codes and error cases: validation failure, missing row,
  invalid JSON, an empty result;
- anything to be decided in the plan — phrase it as «решить в плане»; the assignee then stops after
  the plan commit and waits for the author's approval.

## Решения автора (<date>) _(optional)_

The author's answers given before the work starts — final for the assignee.

## Готово когда

Observable criteria that can be checked by hand — not "done", but "when X is requested, the API
answers Y".

## Риски и крайние случаи _(optional)_

What can break and which other issues or API clients it affects.

## Вне скоупа _(optional)_

What is deliberately excluded — adjacent work goes into separate issues, linked.

## Обязательно проверить и обновить

Keep the relevant lines, delete the rest. Copy them into the issue as-is:

- [ ] `ai/superpowers/` — план (+ спека, если меняется поведение API) одним коммитом до кода
- [ ] `README.md` — настройка, скрипты, env, публичный API
- [ ] `ai/map.md` — если добавлен, переименован или удалён файл, папка, роут, модель, env-переменная, скрипт или Docker-файл
- [ ] `ai/rules/*`, `ai/skills/*` — если изменился паттерн
- [ ] `ai/decisions/` — датированная запись, если зафиксировано долгоживущее решение

## Проверка

Copy into the issue, one line per check under "Verification" in `AGENTS.md`, plus the manual line:

- [ ] `npm run format:check`
- [ ] `npm test`
- [ ] Прогнано руками: запросы к каждому затронутому эндпоинту (curl) на своём временном Postgres, включая ошибки (валидация, 404, невалидный JSON)

The project keeps its automated tests: verification is the checks and calling the API by hand.
